import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../database/entities/session.entity';
import { Feedback } from '../database/entities/feedback.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { RequestsService } from '../requests/requests.service';
import { AvailabilityService } from '../availability/availability.service';
import { RequestStatus } from '../common/enums/request-status.enum';
import { SessionStatus } from '../common/enums/session-status.enum';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    private requestsService: RequestsService,
    private availabilityService: AvailabilityService,
  ) {}

  async create(menteeId: string, createDto: CreateSessionDto): Promise<Session> {
    // Verify the request exists and is accepted
    const request = await this.requestsService.findAcceptedMentorships(menteeId, UserRole.MENTEE);
    const validRequest = request.find(r => r.id === createDto.requestId);

    if (!validRequest) {
      throw new BadRequestException('Invalid or non-accepted request');
    }

    // Check if a session already exists for this request
    const existingSession = await this.sessionsRepository.findOne({
      where: { requestId: createDto.requestId },
    });

    if (existingSession) {
      throw new BadRequestException('Session already exists for this request');
    }

    // Validate scheduling time (should be in the future)
    const scheduledTime = new Date(createDto.scheduledAt);
    if (scheduledTime <= new Date()) {
      throw new BadRequestException('Session must be scheduled in the future');
    }

    // TODO: Validate against mentor's availability

    const session = this.sessionsRepository.create({
      ...createDto,
      mentorId: validRequest.mentorId,
      menteeId,
      status: SessionStatus.SCHEDULED,
    });

    return this.sessionsRepository.save(session);
  }

  async findMentorSessions(mentorId: string): Promise<Session[]> {
    return this.sessionsRepository.find({
      where: { mentorId },
      relations: ['mentee', 'mentee.profile', 'request'],
      order: { scheduledAt: 'DESC' },
    });
  }

  async findMenteeSessions(menteeId: string): Promise<Session[]> {
    return this.sessionsRepository.find({
      where: { menteeId },
      relations: ['mentor', 'mentor.profile', 'request'],
      order: { scheduledAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionsRepository.findOne({
      where: { id },
      relations: ['mentor', 'mentee', 'request'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async submitFeedback(
    sessionId: string,
    userId: string,
    userRole: UserRole,
    feedbackDto: SubmitFeedbackDto,
  ): Promise<Feedback> {
    const session = await this.findOne(sessionId);

    // Verify user is part of the session
    if (userRole === UserRole.MENTEE && session.menteeId !== userId) {
      throw new ForbiddenException('You are not part of this session');
    }
    if (userRole === UserRole.MENTOR && session.mentorId !== userId) {
      throw new ForbiddenException('You are not part of this session');
    }

    // Check if session is completed
    if (session.status !== SessionStatus.COMPLETED) {
      throw new BadRequestException('Feedback can only be submitted for completed sessions');
    }

    // Check if feedback already exists
    let feedback = await this.feedbackRepository.findOne({
      where: { sessionId },
    });

    if (!feedback) {
      feedback = this.feedbackRepository.create({
        sessionId,
        rating: userRole === UserRole.MENTEE ? feedbackDto.rating : 0,
        menteeComment: userRole === UserRole.MENTEE ? feedbackDto.comment || null : null,
        mentorComment: userRole === UserRole.MENTOR ? feedbackDto.comment || null : null,
      });
    } else {
      if (userRole === UserRole.MENTEE) {
        feedback.rating = feedbackDto.rating;
        feedback.menteeComment = feedbackDto.comment || null;
      } else {
        feedback.mentorComment = feedbackDto.comment || null;
      }
    }

    return this.feedbackRepository.save(feedback);
  }

  async updateSessionStatus(id: string, status: SessionStatus): Promise<Session> {
    const session = await this.findOne(id);
    session.status = status;
    return this.sessionsRepository.save(session);
  }

  async getAllSessions(): Promise<Session[]> {
    return this.sessionsRepository.find({
      relations: ['mentor', 'mentee', 'mentor.profile', 'mentee.profile'],
      order: { scheduledAt: 'DESC' },
    });
  }
}
