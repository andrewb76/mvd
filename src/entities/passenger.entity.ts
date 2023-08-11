import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity()
export class Passenger {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ nullable: false })
  ticket_id: number;

  @Column({ nullable: false })
  surname: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  patronymic?: string;

  @Column({ nullable: true })
  birthday?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  documentType?: string;

  @Column({ nullable: true })
  documentNumber?: string;

  @OneToOne(() => Ticket, (ticket) => ticket.passanger)
  ticket: Ticket;
}
