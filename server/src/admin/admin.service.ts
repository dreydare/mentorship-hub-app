import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { RequestsService } from '../requests/requests.service';
import { MentorshipRequest } from '../database/entities/mentorship-request.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { AssignMentorDto } from './dto/assign-mentor.dto';
import { RequestStatus } from '../common/enums/request-status.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(MentorshipRequest)
    private requestsRepository: Repository<MentorshipRequest>,
    private usersService: UsersService,
    private sessionsService: SessionsService,
    private requestsService: RequestsService,
  ) {}

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async updateUserRole(userId: string, updateRoleDto: UpdateUserRoleDto) {
    return this.usersService.updateRole(userId, updateRoleDto.role);
  }

  async getAllMatches() {
    return this.requestsRepository.find({
      where: { status: RequestStatus.ACCEPTED },
      relations: ['mentor', 'mentee', 'mentor.profile', 'mentee.profile'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getAllSessions() {
    return this.sessionsService.getAllSessions();
  }

  async assignMentor(assignDto: AssignMentorDto) {
    // Create an automatic request and accept it
    const request = this.requestsRepository.create({
      mentorId: assignDto.mentorId,
      menteeId: assignDto.menteeId,
      message: 'Assigned by admin',
      status: RequestStatus.ACCEPTED,
    });

    return this.requestsRepository.save(request);
  }

  async getDashboardStats() {
    const usersCount = await this.usersService.findAll();
    const totalMatches = await this.requestsRepository.count({
      where: { status: RequestStatus.ACCEPTED },
    });
    const totalSessions = await this.sessionsService.getAllSessions();

    return {
      totalUsers: usersCount.length,
      totalMentors: usersCount.filter(u => u.role === 'mentor').length,
      totalMentees: usersCount.filter(u => u.role === 'mentee').length,
      totalMatches,
      totalSessions: totalSessions.length,
      completedSessions: totalSessions.filter(s => s.status === 'completed').length,
    };
  }
}
