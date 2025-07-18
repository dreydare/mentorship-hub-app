import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty()
  @IsUUID()
  mentorId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  message?: string;
}