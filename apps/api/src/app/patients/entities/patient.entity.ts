import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}