import { Module } from '@nestjs/common';
import { UserInfrastructureModule } from '@infrastructure/users/user-infrastructure.module';
import { JwtTokenService } from '@shared/services/jwt.service';
import { PasswordService } from '@shared/services/password.service';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { ValidateUserUseCase } from './use-cases/validate-user.usecase';

@Module({
  imports: [UserInfrastructureModule],
  providers: [
    CreateUserUseCase,
    ValidateUserUseCase,
    PasswordService,
    JwtTokenService,
  ],
  exports: [CreateUserUseCase, ValidateUserUseCase],
})
export class UserApplicationModule {}


