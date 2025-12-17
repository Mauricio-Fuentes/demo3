import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '@application/users/use-cases/create-user.usecase';
import { ValidateUserUseCase } from '@application/users/use-cases/validate-user.usecase';
import { CreateUserRequest } from './dto/create-user.request';
import { ValidateUserRequest } from './dto/validate-user.request';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly validateUserUseCase: ValidateUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
      schema: {
        example: {
          id: 'user-1',
          name: 'Mauricio',
          email: 'mauricio@example.com',
          password: '$2b$10$hashedPassword1234567890123456789012345678901234567890123456789012',
          status: 'ACTIVE',
          scope: 'openid profile email',
          dateRegister: '2024-01-01T00:00:00.000Z',
          dateModify: null,
        },
      },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario con el ID especificado ya existe',
    schema: {
      example: {
        statusCode: 409,
        message: "El usuario con ID 'user-1' ya existe",
      },
    },
  })
  async create(@Body() body: CreateUserRequest) {
    const user = await this.createUserUseCase.execute(body);
    return user.toPrimitives();
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validar credenciales de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Credenciales válidas - Tokens generados',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6Im1hdXJpY2lvQGV4YW1wbGUuY29tIiwibmFtZSI6Ik1hdXJpY2lvIiwiaWF0IjoxNTE2MjM5MDIyfQ',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token:
          'def50200a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
        scope: 'openid profile email',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciales inválidas',
      },
    },
  })
  async validate(@Body() body: ValidateUserRequest) {
    return this.validateUserUseCase.execute(body);
  }
}


