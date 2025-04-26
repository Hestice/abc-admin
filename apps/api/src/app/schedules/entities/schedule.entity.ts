import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

export enum ScheduleStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum VaccinationDay {
  DAY_0 = 0,
  DAY_3 = 3,
  DAY_7 = 7,
  DAY_28 = 28,
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Patient, (patient) => patient.schedule)
  @JoinColumn()
  patient!: Patient;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.IN_PROGRESS,
  })
  status!: ScheduleStatus;

  @Column({
    type: 'date',
    nullable: false,
    transformer: {
      to: (value: Date) => {
        if (!value) return null;
        // Store only the date portion in ISO format
        return value instanceof Date
          ? value.toISOString().split('T')[0]
          : value;
      },
      from: (value: string) => {
        if (!value) return null;
        // Create a Date object from the stored date string
        const date = new Date(value);
        return date;
      },
    },
  })
  day0Date!: Date;

  @Column({
    type: 'date',
    nullable: false,
    transformer: {
      to: (value: Date) => {
        if (!value) return null;
        // Store only the date portion in ISO format
        return value instanceof Date
          ? value.toISOString().split('T')[0]
          : value;
      },
      from: (value: string) => {
        if (!value) return null;
        // Create a Date object from the stored date string
        const date = new Date(value);
        return date;
      },
    },
  })
  day3Date!: Date;

  @Column({
    type: 'date',
    nullable: false,
    transformer: {
      to: (value: Date) => {
        if (!value) return null;
        // Store only the date portion in ISO format
        return value instanceof Date
          ? value.toISOString().split('T')[0]
          : value;
      },
      from: (value: string) => {
        if (!value) return null;
        // Create a Date object from the stored date string
        const date = new Date(value);
        return date;
      },
    },
  })
  day7Date!: Date;

  @Column({
    type: 'date',
    nullable: false,
    transformer: {
      to: (value: Date) => {
        if (!value) return null;
        // Store only the date portion in ISO format
        return value instanceof Date
          ? value.toISOString().split('T')[0]
          : value;
      },
      from: (value: string) => {
        if (!value) return null;
        // Create a Date object from the stored date string
        const date = new Date(value);
        return date;
      },
    },
  })
  day28Date!: Date;

  @Column({ type: 'boolean', default: false })
  day0Completed!: boolean;

  @Column({ type: 'boolean', default: false })
  day3Completed!: boolean;

  @Column({ type: 'boolean', default: false })
  day7Completed!: boolean;

  @Column({ type: 'boolean', default: false })
  day28Completed!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  day0CompletedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  day3CompletedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  day7CompletedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  day28CompletedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
