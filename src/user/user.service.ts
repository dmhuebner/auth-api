import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { RegisterVm } from './models/view-models/register-vm.model';
import { compare, genSalt, hash } from 'bcryptjs';
import { LoginVm } from './models/view-models/login-vm.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { JwtPayload } from '../shared/auth/jwt-payload';
import { AuthService } from '../shared/auth/auth.service';
import { UserVm } from './models/view-models/user-vm.model';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.modelName) private readonly _userModel: ModelType<User>,
    private readonly _mapperService: MapperService,
    @Inject(forwardRef(() => AuthService)) private readonly _authService: AuthService
  ) {
    super();
    this._model = _userModel;
    this._mapper = _mapperService.mapper;
  }

  async register(registerVm: RegisterVm): Promise<LoginResponseVm> {
    const { email, password, username, firstName, lastName } = registerVm;
    const newUser = new this._model();
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.username = username;
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    try {
      const createdUser = await this.create(newUser);
      const userVm: UserVm = await this.map<UserVm>(createdUser.toJSON());
      const token = await this.createJwtToken(createdUser.toJSON());

      return {
        user: userVm,
        token
      };
    } catch (error) {
      // Database error
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginVm: LoginVm): Promise<LoginResponseVm> {
    const { email, password } = loginVm;

    const user = await this.findOne({email});

    if (!user) {
      throw new HttpException({message: 'Invalid credentials'}, HttpStatus.UNAUTHORIZED);
    } else {
      const isMatch = await compare(password, user.password);

      if (!isMatch) {
        throw new HttpException({message: 'Invalid credentials'}, HttpStatus.UNAUTHORIZED);
      } else {
        const token = await this.createJwtToken(user);
        const userVm: UserVm = await this.map<UserVm>(user.toJSON());

        return {
          user: userVm,
          token
        };
      }
    }
  }

  private async createJwtToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      email: user.email,
      role: user.role
    };

    return this._authService.signPayload(payload);
  }
}
