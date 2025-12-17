import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserProps } from '@domain/users/entities/user.entity';
import {
  UserRepository,
} from '@domain/users/repositories/user.repository';
import { UserDocument } from '../schemas/user.schema';

export class UserMongoRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<User> {
    const props: UserProps = user.toPrimitives();
    const created = await this.userModel.create(props);

    return User.rehydrate({
      id: created.id,
      name: created.name,
      email: created.email,
      password: created.password,
      status: created.status,
      scope: created.scope,
      dateRegister: created.dateRegister,
      dateModify: created.dateModify ?? null,
    });
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ id }).exec();
    if (!doc) {
      return null;
    }

    return User.rehydrate({
      id: doc.id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
      status: doc.status,
      scope: doc.scope,
      dateRegister: doc.dateRegister,
      dateModify: doc.dateModify ?? null,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    if (!doc) {
      return null;
    }

    return User.rehydrate({
      id: doc.id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
      status: doc.status,
      scope: doc.scope,
      dateRegister: doc.dateRegister,
      dateModify: doc.dateModify ?? null,
    });
  }
}


