import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '@domain/users/repositories/user.repository';
import { PasswordService } from '@shared/services/password.service';
import { JwtTokenService, TokenResponse } from '@shared/services/jwt.service';
import { ValidateUserDto } from '../dto/validate-user.dto';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(input: ValidateUserDto): Promise<TokenResponse> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Credenciales inválidas',
      });
    }

    // Verificar password
    const isPasswordValid = await this.passwordService.comparePassword(
      input.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Credenciales inválidas',
      });
    }

    // Generar tokens JWT
    return this.jwtTokenService.generateTokens(user);
  }
}

