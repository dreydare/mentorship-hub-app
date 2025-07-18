import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post()
  @Roles(UserRole.MENTEE)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Schedule a session (Mentee only, after request accepted)' })
  async create(
    @CurrentUser() user: any,
    @Body() createDto: CreateSessionDto,
  ) {
    return this.sessionsService.create(user.userId, createDto);
  }

  @Get('mentor')
  @Roles(UserRole.MENTOR)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sessions where current user is mentor' })
  async getMentorSessions(@CurrentUser() user: any) {
    return this.sessionsService.findMentorSessions(user.userId);
  }

  @Get('mentee')
  @Roles(UserRole.MENTEE)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sessions where current user is mentee' })
  async getMenteeSessions(@CurrentUser() user: any) {
    return this.sessionsService.findMenteeSessions(user.userId);
  }

  @Put(':id/feedback')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit feedback for a session' })
  async submitFeedback(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() feedbackDto: SubmitFeedbackDto,
  ) {
    return this.sessionsService.submitFeedback(
      id,
      user.userId,
      user.role,
      feedbackDto,
    );
  }
}
