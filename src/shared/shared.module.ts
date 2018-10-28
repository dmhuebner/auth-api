import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { MapperService } from './mapper/mapper.service';
import { AuthService } from './auth/auth.service';
import { JwtStrategyService } from './auth/strategies/jwt-strategy.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [UserModule],
  providers: [ConfigService, MapperService, AuthService, JwtStrategyService],
  exports: [ConfigService, MapperService, AuthService]
})
export class SharedModule {}
