import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './schemas/user.schema';
import { UserMongoRepository } from './repositories/user-mongo.repository';
import { USER_REPOSITORY } from '@domain/users/repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserMongoRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserInfrastructureModule {}


