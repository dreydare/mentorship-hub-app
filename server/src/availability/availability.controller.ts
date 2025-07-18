import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Availability')
@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Post()
  @Roles(UserRole.MENTOR)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create availability slot (Mentor only)' })
  async create(
    @CurrentUser() user: any,
    @Body() createDto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.create(user.userId, createDto);
  }

  @Get()
  @Roles(UserRole.MENTOR)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my availability slots (Mentor only)' })
  async getMyAvailability(@CurrentUser() user: any) {
    return this.availabilityService.findByMentor(user.userId);
  }

  @Get('mentor/:mentorId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get mentor availability (for booking)' })
  async getMentorAvailability(@Param('mentorId') mentorId: string) {
    return this.availabilityService.findActiveMentorAvailability(mentorId);
  }

  @Put(':id')
  @Roles(UserRole.MENTOR)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update availability slot (Mentor only)' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateDto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.update(id, user.userId, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.MENTOR)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete availability slot (Mentor only)' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.availabilityService.remove(id, user.userId);
    return { message: 'Availability deleted successfully' };
  }
}
