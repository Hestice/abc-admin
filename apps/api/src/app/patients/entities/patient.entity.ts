import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Exposure } from '../../exposures/entities/exposure.entity';
import { Sex } from '@abc-admin/enums';

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

  @ManyToOne(() => User, { nullable: true })
  managedBy?: User;

  @OneToMany(() => Exposure, (exposure) => exposure.patient)
  exposures!: Exposure[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
