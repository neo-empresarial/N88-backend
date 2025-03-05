import { Controller, Get, Post, Query } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @Get('/')
  async findAll() {
    return this.feedbackService.findAll();
  }

  @Post()
  async create(@Query('message') message: string) {
    return this.feedbackService.create(message);
  }
}