import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MentorshipRequest } from '../database/entities/mentorship-request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { RequestStatus } from '../common/enums/request-status.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(MentorshipRequest)
    private requestsRepository: Repository<MentorshipRequest>,
    private usersService: UsersService,
  ) {}

  async create(menteeId: string, createRequestDto: CreateRequestDto): Promise<MentorshipRequest> {
    const { mentorId, message } = createRequestDto;

    // Verify mentor exists and is actually a mentor
    const mentor = await this.usersService.findById(mentorId);
    if (mentor.role !== UserRole.MENTOR) {
      throw new BadRequestException('User is not a mentor');
    }

    // Check if request already exists
    const existingRequest = await this.requestsRepository.findOne({
      where: {
        mentorId,
        menteeId,
        status: RequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new BadRequestException('A pending request already exists for this mentor');
    }

    const request = this.requestsRepository.create({
      mentorId,
      menteeId,
      message,
      status: RequestStatus.PENDING,
    });

    return this.requestsRepository.save(request);
  }

  async findSentRequests(menteeId: string): Promise<MentorshipRequest[]> {
    return this.requestsRepository.find({
      where: { menteeId },
      relations: ['mentor', 'mentor.profile'],
      order: { createdAt: 'DESC' },
    });
  }

  async findReceivedRequests(mentorId: string): Promise<MentorshipRequest[]> {
    return this.requestsRepository.find({
      where: { mentorId },
      relations: ['mentee', 'mentee.profile'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    requestId: string,
    mentorId: string,
    updateDto: UpdateRequestStatusDto,
  ): Promise<MentorshipRequest> {
    const request = await this.requestsRepository.findOne({
      where: { id: requestId },
      relations: ['mentor', 'mentee'],
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.mentorId !== mentorId) {
      throw new ForbiddenException('You can only update your own requests');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be updated');
    }

    request.status = updateDto.status;

    return this.requestsRepository.save(request);
  }

  async findAcceptedMentorships(userId: string, role: UserRole): Promise<MentorshipRequest[]> {
    const whereCondition = role === UserRole.MENTOR 
      ? { mentorId: userId, status: RequestStatus.ACCEPTED }
      : { menteeId: userId, status: RequestStatus.ACCEPTED };

    return this.requestsRepository.find({
      where: whereCondition,
      relations: ['mentor', 'mentee', 'mentor.profile', 'mentee.profile'],
      order: { updatedAt: 'DESC' },
    });
  }
}
