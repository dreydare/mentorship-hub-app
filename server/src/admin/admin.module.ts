import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MentorshipRequest } from '../database/entities/mentorship-request.entity';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { RequestsModule } from '../requests/requests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorshipRequest]),
    UsersModule,
    SessionsModule,
    RequestsModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
