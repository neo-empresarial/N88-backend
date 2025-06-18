import { IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator';

export class ShareScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  scheduleId: number;

  @IsNotEmpty()
  @IsNumber()
  groupId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  userIds?: number[];
}

export class AcceptSharedScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  sharedScheduleId: number;
}

export class SharedScheduleResponseDto {
  id: number;
  scheduleId: number;
  sharedByUserId: number;
  sharedByUserName: string;
  sharedWithUserId: number;
  groupId: number;
  groupName: string;
  sharedAt: Date;
  isAccepted: boolean;
  acceptedAt?: Date;
  originalSchedule: {
    title: string;
    description: string;
    items: Array<{
      subjectCode: string;
      classCode: string;
      activated: boolean;
    }>;
  };
}
