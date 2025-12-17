import { ApiProperty } from '@nestjs/swagger';

export class ValidateUserRequest {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'mauricio@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'secreto123',
    minLength: 6,
  })
  password: string;
}

