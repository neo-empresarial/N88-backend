export class CompetitionScoreDto {
  code: string;
  averageOrdersWithoutVacancy: number;
  category: 'Baixa' | 'Média' | 'Alta';
  semesterCount: number;
}

export class BatchCompetitionScoreDto {
  scores: CompetitionScoreDto[];
  requestedCodes: string[];
  foundCodes: string[];
  notFoundCodes: string[];
}
