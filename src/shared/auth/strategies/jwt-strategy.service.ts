import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { ConfigService } from '../../config/config.service';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Config } from '../../config/config.enum';
import { JwtPayload } from '../jwt-payload';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(
    private readonly _authService: AuthService,
    private  readonly _configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get(Config.JWT_KEY)
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    const user = await this._authService.validatePayload(payload);

    if (!user) {
      return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
    } else {
      return done(null, user, payload.iat);
    }
  }
}
