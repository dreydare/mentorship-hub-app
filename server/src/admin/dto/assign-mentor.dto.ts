import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignMentorDto {
  @ApiProperty()
  @IsUUID()
  mentorId: string;

  @ApiProperty()
  @IsUUID()
  menteeId: string;
}