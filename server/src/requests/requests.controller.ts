import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Mentorship Requests')
@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Post()
  @Roles(UserRole.MENTEE)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a mentorship request (Mentee only)' })
  async create(
    @CurrentUser() user: any,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return this.requestsService.create(user.userId, createRequestDto);
  }

  @Get('sent')
  @Roles(UserRole.MENTEE)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get sent mentorship requests (Mentee only)' })
  async getSentRequests(@CurrentUser() user: any) {
    return this.requestsService.findSentRequests(user.userId);
  }

  @Get('received')
  @Roles(UserRole.MENTOR)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get received mentorship requests (Mentor only)' })
  async getReceivedRequests(@CurrentUser() user: any) {
    return this.requestsService.findReceivedRequests(user.userId);
  }

  @Put(':id')
  @Roles(UserRole.MENTOR)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update request status - Accept/Reject (Mentor only)' })
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateStatusDto: UpdateRequestStatusDto,
  ) {
    return this.requestsService.updateStatus(id, user.userId, updateStatusDto);
  }

  @Get('accepted')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all accepted mentorship matches for current user' })
  async getAcceptedMentorships(@CurrentUser() user: any) {
    return this.requestsService.findAcceptedMentorships(user.userId, user.role);
  }
}
