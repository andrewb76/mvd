import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trace } from './trace.entity';

interface IOryProfile {
  id?: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  ory: IOryProfile;

  @ManyToMany(() => Trace, (trace) => trace.watchers)
  traces: Trace[];
}
