import { IsEnum, IsString, IsMilitaryTime } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '../../database/entities/availability.entity';

export class CreateAvailabilityDto {
  @ApiProperty({ enum: DayOfWeek })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty({ example: '09:00' })
  @IsString()
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  @IsMilitaryTime()
  endTime: string;
}