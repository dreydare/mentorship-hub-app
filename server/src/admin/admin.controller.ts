import { Controller, Get, Put, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { AssignMentorDto } from './dto/assign-mentor.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id/role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(id, updateRoleDto);
  }

  @Get('matches')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all mentorship matches (Admin only)' })
  async getAllMatches() {
    return this.adminService.getAllMatches();
  }

  @Get('sessions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sessions (Admin only)' })
  async getAllSessions() {
    return this.adminService.getAllSessions();
  }

  @Post('assign-mentor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually assign a mentor to a mentee (Admin only)' })
  async assignMentor(@Body() assignDto: AssignMentorDto) {
    return this.adminService.assignMentor(assignDto);
  }

  @Get('dashboard-stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dashboard statistics (Admin only)' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}
