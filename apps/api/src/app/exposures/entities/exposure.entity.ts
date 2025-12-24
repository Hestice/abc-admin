import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Category, Status } from '@abc-admin/enums';

@Entity('exposures')
export class Exposure {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Patient, (patient) => patient.exposures)
  @JoinColumn({ name: 'patientId' })
  patient!: Patient;

  @Column({
    type: 'enum',
    enum: Category,
  })
  category!: Category;

  @Column()
  bodyPartsAffected!: string;

  @Column()
  placeOfExposure!: string;

  @Column({ type: 'date' })
  dateOfExposure!: Date;

  @Column()
  isExposureAtHome!: boolean;

  @Column()
  sourceOfExposure!: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.UNKNOWN,
  })
  animalStatus!: Status;

  @Column()
  isWoundCleaned!: boolean;

  @Column()
  antiTetanusGiven!: boolean;

  @Column({ type: 'date', nullable: true })
  dateOfAntiTetanus?: Date;

  @Column()
  briefHistory!: string;

  @Column()
  allergy!: string;

  @Column()
  medications!: string;

  @OneToMany(() => Schedule, (schedule) => schedule.exposure)
  schedules!: Schedule[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
