import { CreateUserDtoRoleEnum } from '@abc-admin/api-lib';

export interface Admin {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface NewAdmin {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: CreateUserDtoRoleEnum;
  password: string;
  confirmPassword: string;
  isActive: boolean;
}
