import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class ConsumeInviteCodeDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The invite code UUID to consume',
  })
  @IsUUID()
  @IsNotEmpty()
  code!: string;
}
