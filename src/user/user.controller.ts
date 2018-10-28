import { Controller, Post, HttpStatus, Body, HttpException } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { RegisterVm } from './models/view-models/register-vm.model';
import { UserVm } from './models/view-models/user-vm.model';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';

@Controller('users')
@ApiUseTags(User.modelName)
export class UserController {
   constructor(private readonly _userService: UserService) {}

   @Post('register')
   @ApiResponse({status: HttpStatus.CREATED, type: UserVm})
   @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
   @ApiOperation(GetOperationId(User.modelName, 'Register'))
   async register(@Body() registerVm: RegisterVm): Promise<LoginResponseVm> {
     const { email, password } = registerVm;

     if (!email) {
       throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
     }

     if (!password) {
       throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
     }


     let emailAlreadyExists;

     try {
       emailAlreadyExists = await this._userService.findOne({email});
     } catch (error) {
       throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
     }

     if (emailAlreadyExists) {
       throw new HttpException('That email is already registered', HttpStatus.BAD_REQUEST);
     }

     return this._userService.register(registerVm);
   }

  @Post('login')
  @ApiResponse({status: HttpStatus.CREATED, type: LoginResponseVm})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
  @ApiOperation(GetOperationId(User.modelName, 'Login'))
   async login(@Body() loginVm: LoginVm): Promise<LoginResponseVm> {
    const fields = Object.keys(UserVm);
    fields.forEach(field => {
      if (!loginVm[field]) {
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
      }
    });

    return this._userService.login(loginVm);
  }
}
