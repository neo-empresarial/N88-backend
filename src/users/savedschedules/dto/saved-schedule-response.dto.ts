export class SavedScheduleItemResponseDto {
  subjectCode: string;
  classCode: string;
  activated: boolean;
}

export class SavedScheduleResponseDto {
  idsavedschedule: number;
  title: string;
  description: string;
  items: SavedScheduleItemResponseDto[];
}
