import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from '../database/entities/availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
  ) {}

  async create(mentorId: string, createDto: CreateAvailabilityDto): Promise<Availability> {
    // Check if availability already exists for this day and mentor
    const existing = await this.availabilityRepository.findOne({
      where: {
        mentorId,
        dayOfWeek: createDto.dayOfWeek,
      },
    });

    if (existing) {
      throw new BadRequestException(`Availability already exists for ${createDto.dayOfWeek}`);
    }

    // Validate time range
    if (createDto.startTime >= createDto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    const availability = this.availabilityRepository.create({
      ...createDto,
      mentorId,
    });

    return this.availabilityRepository.save(availability);
  }

  async findByMentor(mentorId: string): Promise<Availability[]> {
    return this.availabilityRepository.find({
      where: { mentorId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(id: string, mentorId: string): Promise<Availability> {
    const availability = await this.availabilityRepository.findOne({
      where: { id, mentorId },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    return availability;
  }

  async update(
    id: string,
    mentorId: string,
    updateDto: UpdateAvailabilityDto,
  ): Promise<Availability> {
    const availability = await this.findOne(id, mentorId);

    // Validate time range if times are being updated
    if (updateDto.startTime || updateDto.endTime) {
      const startTime = updateDto.startTime || availability.startTime;
      const endTime = updateDto.endTime || availability.endTime;
      
      if (startTime >= endTime) {
        throw new BadRequestException('Start time must be before end time');
      }
    }

    Object.assign(availability, updateDto);

    return this.availabilityRepository.save(availability);
  }

  async remove(id: string, mentorId: string): Promise<void> {
    const availability = await this.findOne(id, mentorId);
    await this.availabilityRepository.remove(availability);
  }

  async findActiveMentorAvailability(mentorId: string): Promise<Availability[]> {
    return this.availabilityRepository.find({
      where: { mentorId, isActive: true },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }
}
