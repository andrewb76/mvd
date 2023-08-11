import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('tickets_log')
export class TicketLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  ticket_id: number;

  @Column({ nullable: false })
  field: string;

  @Column({ nullable: false })
  old_value: string;

  @Column({ nullable: false })
  new_value: string;

  @Column({ nullable: false })
  changed_at: Date;
}
