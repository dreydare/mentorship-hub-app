import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { MentorshipRequest } from './mentorship-request.entity';
import { SessionStatus } from '../../common/enums/session-status.enum';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mentorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'mentorId' })
  mentor: User;

  @Column()
  menteeId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'menteeId' })
  mentee: User;

  @Column()
  requestId: string;

  @ManyToOne(() => MentorshipRequest)
  @JoinColumn({ name: 'requestId' })
  request: MentorshipRequest;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.SCHEDULED,
  })
  status: SessionStatus;

  @Column({ nullable: true })
  meetingLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}