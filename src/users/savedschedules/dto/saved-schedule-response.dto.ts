export class SavedScheduleItemResponseDto {
  subjectCode: string;
  classCode: string;
  activated: boolean;
  credits?: number;
}

export class SavedSchedulePlanResponseDto {
  planNumber: number;
  credits: number;
  items: SavedScheduleItemResponseDto[];
}

export class SavedScheduleResponseDto {
  idsavedschedule: number;
  title: string;
  description: string;
  totalCredits: number;
  plans: SavedSchedulePlanResponseDto[];
  items?: SavedScheduleItemResponseDto[]; // Legacy support
  semester?: string;
}
