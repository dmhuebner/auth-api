import { BaseModel, schemaOptions } from '../../shared/base.model';
import { UserRole } from './user-role.enum';
import { ModelType, prop } from 'typegoose';

export class User extends BaseModel<User> {
  @prop({
    required: [true, 'Email is required'],
    minlength: [5, 'Email must be at least 5 characters long'],
    unique: true
  })
  email: string;

  @prop({
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  })
  password: string;

  @prop()
  username?: string;

  @prop({enum: UserRole, default: UserRole.User})
  role?: UserRole;

  @prop()
  firstName?: string;

  @prop()
  lastName?: string;

  @prop()
  get fullName(): string {
    return this.firstName && this.lastName ? `${this.firstName} ${this.lastName}` : '';
  }

  static get model(): ModelType<User> {
    return new User().getModelForClass(User, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}