import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { Observable } from 'rxjs';


@Injectable()
export class AmqpService implements OnModuleDestroy, OnModuleInit {
  private logger = new Logger('amqp');
  private connections = {};

  constructor(private readonly config: ConfigService) {
    // config.get('amqp');
  }

  async onModuleInit() {
    return Promise.resolve();
  }

  async getQueueSender(url: string, queue: string, queueOpt: any = {}) {
    return Promise.resolve()
      .then(() => {
        if (this.connections[url]) {
          return this.connections[url];
        }
        return amqp.connect(url);
      })
      .then((conn) => {
        this.connections[url] = conn;
        return conn.createChannel();
      })
      .then((channel) => {
        channel.assertQueue(queue, queueOpt);
        return (payload) =>
          channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
      });
  }
  async getConsumer(url: string, queue: string, queueOpt: any = {}, opt = {}) {
    return Promise.resolve()
      .then(() => {
        if (this.connections[url]) {
          return this.connections[url];
        }
        return amqp.connect(url);
      })
      .then((conn) => {
        this.connections[url] = conn;
        return conn.createChannel();
      })
      .then((channel) => {
        channel.assertQueue(queue, queueOpt);
        return new Observable((subscriber) => {
          this.logger.log('consumer for ${queue} initializing ...');
          channel.consume(
            '',
            (message) => {
              if (message) {
                subscriber.next(message);
              }
            },
            { noAck: true },
          );
        });
      });
  }

  // ToDo
  async onModuleDestroy() {
    this.logger.log('onModuleDestroy terminate connections ...(todo)');
    for (let i = 0; i < Object.keys(this.connections).length; i++) {
      this.connections[Object.keys(this.connections)[i]].close();
    }
    // await this.mvdChannel.close();
    // await this.mvdSendChannel.close();
    // await this.imsChannel.close();
    // await this.mvdConnection.close();
    // await this.imsConnection.close();
    this.logger.log('onModuleDestroy connections terminated.(todo)');
  }
}
