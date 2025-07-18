import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Session } from './session.entity';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @OneToOne(() => Session)
  @JoinColumn({ name: 'sessionId' })
  session: Session;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  menteeComment: string | null;

  @Column({ type: 'text', nullable: true })
  mentorComment: string | null;

  @CreateDateColumn()
  createdAt: Date;
}