import { Controller, Get, Logger, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { AmqpService } from './amqp/amqp.service';
import { buffer, interval } from 'rxjs';
import { TicketDTO } from './dto/Tiket.dto';
import { PassengerDTO } from './dto/Passenger.dto';

const statuses = ['active', 'planted', 'canceled'];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
};

const getMocTiket = (ticket_id) => {
  const t: TicketDTO = {
    id: ticket_id,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    departureCity: 'Москва',
    departureStation: `Вокзал ${getRandomInt(1, 9)}`,
    departureCoodrs: '10;10',
    departureAt: `10:${getRandomInt(10, 59)}`,
    arrivalCity: 'Минск',
    arrivalStation: `Вокзал ${getRandomInt(1, 9)}`,
    arrivalCoodrs: '20;20',
    arrivalAt: `21:${getRandomInt(10, 59)}`,
    routePath: 'Москва, Химки, Минск',
    carName: 'Камаз',
    carNumber: '01-25крм',
    driverName: 'Иван Иванов',
    driverPhone: '123456789',
  };

  console.log(`MOC Б: [${JSON.stringify(t)}]`);
  return t;
};

const getMocPassenger = (ticket_id) => {
  const p: PassengerDTO = {
    ticket_id,
    surname: 'Иванов',
    name: 'Сергей',
    patronymic: 'Петрович',
    birthday: '01-01-1985',
    gender: ['М', 'Ж'][Math.floor(Math.random() * 2)],
    country: ['РФ', 'РБ'][Math.floor(Math.random() * 2)],
    documentType: 'Паспорт',
    documentNumber: '0102-000333444000',
  };

  console.log(`MOC П: [${JSON.stringify(p)}]`);
  return p;
};

const getMocData = (id) => {
  return {
    ticket: getMocTiket(id),
    passenger: getMocPassenger(id),
  };
};

@Controller()
export class AppController implements OnModuleInit {
  private logger = new Logger('app:c');

  private $toMvdSender;
  private $mvdConsumer;

  constructor(
    private readonly appService: AppService,
    private readonly config: ConfigService,
    private readonly amqp: AmqpService,
  ) {}

  async onModuleInit() {
    this.$toMvdSender = await this.amqp.getQueueSender(
      'amqps://bwdazjvk:UJWOoksqsgNauCusY4PHq5d4J-w5Zx-0@moose.rmq.cloudamqp.com/bwdazjvk',
      'forMvd',
    );

    this.$mvdConsumer = await this.amqp.getConsumer(
      'amqps://bwdazjvk:UJWOoksqsgNauCusY4PHq5d4J-w5Zx-0@moose.rmq.cloudamqp.com/bwdazjvk',
      'forMvd',
    );

    this.$mvdConsumer.subscribe(async (event: any) => {
      const { ticket, passenger } = getMocData(getRandomInt(1, 9));

      // this.logger.log(`:: ${JSON.stringify(event)}`);
      this.appService.updateTicket(ticket);
      this.appService.updatePassenger(passenger);
    });

    // const intervalEvents = interval(1000);
    // const buffered = intervalEvents.pipe(buffer(this.$mvdConsumer));

    // buffered.subscribe((x) => {
    // });

    this.logger.log('>> Controller Init Done.');
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Interval('test', 2000)
  mocEventGenerator() {
    this.logger.log('>> mocEventGenerator');
    this.$toMvdSender({ d: new Date() });
  }
}
