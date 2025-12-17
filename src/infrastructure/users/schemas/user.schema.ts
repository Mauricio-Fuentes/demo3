import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus } from '@domain/users/entities/user.entity';

@Schema({ collection: 'user' })
export class UserDocument extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  status: UserStatus;

  @Prop({ required: true, default: 'openid profile email' })
  scope: string;

  @Prop({ type: Date, required: true })
  dateRegister: Date;

  @Prop({ type: Date, required: false })
  dateModify: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);


