import {
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from '@domain/users/entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepository,
} from '@domain/users/repositories/user.repository';
import { PasswordService } from '@shared/services/password.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(input: CreateUserDto): Promise<User> {
    // Validar si el ID ya existe
    const existingUser = await this.userRepository.findById(input.id);
    if (existingUser) {
      throw new ConflictException({
        statusCode: 409,
        message: `El usuario con ID '${input.id}' ya existe`,
      });
    }

    // Encriptar el password antes de crear el usuario
    const hashedPassword = await this.passwordService.hashPassword(
      input.password,
    );

    const user = User.create({
      id: input.id,
      name: input.name,
      email: input.email,
      password: hashedPassword,
      status: 'ACTIVE',
      scope: input.scope || 'openid profile email', // Scope del input o valor por defecto
    });

    return this.userRepository.create(user);
  }
}


