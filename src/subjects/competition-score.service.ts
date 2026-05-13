import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Subjects } from './subjects.entity';
import { CompetitionScoreDto } from './dto/competition-score.dto';

@Injectable()
export class CompetitionScoreService {
  constructor(
    @InjectRepository(Subjects)
    private readonly subjectsRepository: Repository<Subjects>,
  ) {}

  /**
   * Calculate average score for a specific subject code
   * Averages orders_without_vacancy across all semesters for that code
   */
  async calculateAverageScore(code: string): Promise<CompetitionScoreDto> {
    const subjects = await this.subjectsRepository.find({
      where: { code },
    });

    if (subjects.length === 0) {
      throw new NotFoundException(
        `Subject with code ${code} not found across any semester`,
      );
    }

    const validScores = subjects
      .filter((s) => s.orders_without_vacancy != null)
      .map((s) => s.orders_without_vacancy);

    const averageScore =
      validScores.length > 0
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length
        : 0;

    return {
      code,
      averageOrdersWithoutVacancy: Math.round(averageScore * 100) / 100,
      category: this.getScoreCategory(averageScore),
      semesterCount: subjects.length,
    };
  }

  /**
   * Calculate scores for multiple subject codes in a single batch query
   */
  async calculateBatchScores(codes: string[]): Promise<{
    scores: CompetitionScoreDto[];
    requestedCodes: string[];
    foundCodes: string[];
    notFoundCodes: string[];
  }> {
    if (!codes || codes.length === 0) {
      return {
        scores: [],
        requestedCodes: [],
        foundCodes: [],
        notFoundCodes: [],
      };
    }

    const subjects = await this.subjectsRepository.find({
      where: { code: In(codes) },
    });

    const scoresByCode = new Map<string, CompetitionScoreDto>();
    const foundCodes = new Set<string>();

    // Group subjects by code and calculate averages
    for (const code of codes) {
      const codeSubjects = subjects.filter((s) => s.code === code);

      if (codeSubjects.length > 0) {
        foundCodes.add(code);
        const validScores = codeSubjects
          .filter((s) => s.orders_without_vacancy != null)
          .map((s) => s.orders_without_vacancy);

        const averageScore =
          validScores.length > 0
            ? validScores.reduce((a, b) => a + b, 0) / validScores.length
            : 0;

        scoresByCode.set(code, {
          code,
          averageOrdersWithoutVacancy: Math.round(averageScore * 100) / 100,
          category: this.getScoreCategory(averageScore),
          semesterCount: codeSubjects.length,
        });
      }
    }

    const notFoundCodes = codes.filter((code) => !foundCodes.has(code));
    const scores = Array.from(scoresByCode.values());

    return {
      scores,
      requestedCodes: codes,
      foundCodes: Array.from(foundCodes),
      notFoundCodes,
    };
  }

  /**
   * Determine score category based on average
   * Baixa: 0-5, Média: 5-15, Alta: 15+
   */
  getScoreCategory(score: number): 'Baixa' | 'Média' | 'Alta' {
    if (score < 5) {
      return 'Baixa';
    }
    if (score < 15) {
      return 'Média';
    }
    return 'Alta';
  }
}
