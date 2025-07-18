import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../database/entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async create(userId: string, createProfileDto: CreateProfileDto): Promise<Profile> {
    // Check if profile already exists for this user
    const existingProfile = await this.profilesRepository.findOne({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('Profile already exists for this user');
    }

    const profile = this.profilesRepository.create({
      ...createProfileDto,
      userId,
    });

    return this.profilesRepository.save(profile);
  }

  async findOne(userId: string): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findOne(userId);

    Object.assign(profile, updateProfileDto);

    return this.profilesRepository.save(profile);
  }

  async findAll(): Promise<Profile[]> {
    return this.profilesRepository.find({
      relations: ['user'],
    });
  }

  async findMentors(skills?: string[], industry?: string): Promise<Profile[]> {
    const query = this.profilesRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.role = :role', { role: 'mentor' });

    if (skills && skills.length > 0) {
      // Find mentors who have at least one of the requested skills
      query.andWhere('profile.skills && :skills', { skills });
    }

    if (industry) {
      query.andWhere('profile.industry = :industry', { industry });
    }

    return query.getMany();
  }
}
