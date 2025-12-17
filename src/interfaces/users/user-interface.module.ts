import { Module } from '@nestjs/common';
import { UserApplicationModule } from '@application/users/user-application.module';
import { UsersController } from './users.controller';

@Module({
  imports: [UserApplicationModule],
  controllers: [UsersController],
})
export class UserInterfaceModule {}


