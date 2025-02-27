import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Feedback } from "./feedback.entity";
import { Repository } from "typeorm";

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) { }

  async findAll(): Promise<Feedback[]> {
    const result = this.feedbackRepository.find();

    return result;
  }

  async create(message: string) {
    if (!message) {
      throw new Error("Message is required");
    }

    const newFeedback = new Feedback();
    newFeedback.message = message;

    return this.feedbackRepository.save(newFeedback);
  }
}