import { Controller, Get, Post, Put, Body, UseGuards, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user profile' })
  async create(
    @CurrentUser() user: any,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profilesService.create(user.userId, createProfileDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getMyProfile(@CurrentUser() user: any) {
    return this.profilesService.findOne(user.userId);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMyProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(user.userId, updateProfileDto);
  }

  @Get('mentors')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all mentor profiles with optional filters' })
  @ApiQuery({ name: 'skills', required: false, type: [String] })
  @ApiQuery({ name: 'industry', required: false, type: String })
  async getMentors(
    @Query('skills') skills?: string[],
    @Query('industry') industry?: string,
  ) {
    // Ensure skills is always an array
    const skillsArray = skills ? (Array.isArray(skills) ? skills : [skills]) : undefined;
    return this.profilesService.findMentors(skillsArray, industry);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile by user ID' })
  async getProfile(@Param('userId') userId: string) {
    return this.profilesService.findOne(userId);
  }
}
