export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  scope: string;
  dateRegister: Date;
  dateModify: Date | null;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: Omit<UserProps, 'dateRegister' | 'dateModify'>): User {
    const now = new Date();
    return new User({
      ...props,
      dateRegister: now,
      dateModify: null,
    });
  }

  static rehydrate(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get dateRegister(): Date {
    return this.props.dateRegister;
  }

  get dateModify(): Date | null {
    return this.props.dateModify;
  }

  get scope(): string {
    return this.props.scope;
  }

  updateName(name: string): User {
    return new User({
      ...this.props,
      name,
      dateModify: new Date(),
    });
  }

  updateStatus(status: UserStatus): User {
    return new User({
      ...this.props,
      status,
      dateModify: new Date(),
    });
  }

  toPrimitives(): UserProps {
    return { ...this.props };
  }
}


