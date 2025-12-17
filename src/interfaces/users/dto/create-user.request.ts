import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: 'user-1',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Mauricio',
  })
  name: string;

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

  @ApiProperty({
    description: 'Scope del usuario (opcional). Si no se proporciona, se usa "openid profile email" por defecto',
    example: 'openid profile email',
    required: false,
  })
  scope?: string;
}


