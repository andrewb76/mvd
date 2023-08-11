import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { TicketDTO } from './dto/Tiket.dto';
import { PassengerDTO } from './dto/Passenger.dto';
import { Passenger } from './entities/passenger.entity';

@Injectable()
export class AppService {
  private logger = new Logger('app:s');

  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async updateTicket(payload: TicketDTO) {
    const { id, ...restData } = payload;
    return await this.ticketsRepository
      .createQueryBuilder()
      .insert()
      .into(Ticket)
      .values({
        ticket_id: id,
        ...restData,
      })
      .orUpdate(
        [
          'status',
          'departureCity',
          'departureStation',
          'departureCoodrs',
          'departureAt',
          'arrivalCity',
          'arrivalStation',
          'arrivalCoodrs',
          'arrivalAt',
          'routePath',
          'carName',
          'carNumber',
          'driverName',
          'driverPhone',
        ],
        ['ticket_id'],
      )
      .execute();
  }

  async updatePassenger(payload: PassengerDTO) {
    const { ticket_id, ...restData } = payload;
    return await this.passengerRepository
      .createQueryBuilder()
      .insert()
      .into(Passenger)
      .values({
        ticket_id,
        ...restData,
      })
      .orUpdate(
        [
          'surname',
          'name',
          'patronymic',
          'birthday',
          'gender',
          'country',
          'documentType',
          'documentNumber',
        ],
        ['ticket_id'],
      )
      .execute();
  }
}
