import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import main from './config/main';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AmqpModule } from './amqp/amqp.module';
import { Ticket } from './entities/ticket.entity';
import { TicketLog } from './entities/ticketLog.entity';
import { Trace } from './entities/trace.entity';
import { User } from './entities/user.entity';
import { Passenger } from './entities/passenger.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [main, typeorm],
    }),
    Ticket,
    Passenger,
    TicketLog,
    Trace,
    User,
    TypeOrmModule.forFeature([Ticket, Passenger, TicketLog, Trace, User]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get<DataSourceOptions>('typeorm'),
    }),
    AmqpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, AppController],
})
export class AppModule {}
