import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TicketLog } from './ticketLog.entity';
import { Passenger } from './passenger.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ nullable: false })
  ticket_id: number;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  departureCity: string;

  @Column({ nullable: false })
  arrivalCity: string;

  @Column({ nullable: false })
  departureStation: string;

  @Column({ nullable: false })
  arrivalStation: string;

  @Column({ nullable: false })
  departureCoodrs: string;

  @Column({ nullable: false })
  arrivalCoodrs: string;

  @Column({ nullable: false })
  departureAt: string;

  @Column({ nullable: false })
  arrivalAt: string;

  @Column({ nullable: false })
  routePath: string;

  @Column({ nullable: false })
  carName?: string;

  @Column({ nullable: false })
  carNumber?: string;

  @Column({ nullable: false })
  driverName?: string;

  @Column({ nullable: false })
  driverPhone?: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @OneToOne(() => Passenger, (passenger) => passenger.ticket)
  passanger: Passenger;
}
