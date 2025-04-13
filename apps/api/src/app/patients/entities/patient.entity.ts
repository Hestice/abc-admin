import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Category, Sex } from '@abc-admin/enums';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  lastName!: string;

  @Column({ type: 'date' })
  dateOfBirth!: Date;

  @Column({
    type: 'enum',
    enum: Sex,
  })
  sex!: Sex;

  @Column()
  address!: string;

  @Column({ nullable: true })
  email?: string;

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

  @ManyToOne(() => User, { nullable: true })
  managedBy?: User;

  @OneToOne(() => Schedule, (schedule) => schedule.patient, { nullable: true })
  schedule?: Schedule;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
