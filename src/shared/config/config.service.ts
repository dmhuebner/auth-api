import { Injectable } from '@nestjs/common';
import { Config } from './config.enum';
import { get } from 'config';

@Injectable()
export class ConfigService {

  static connectionString: string = process.env[Config.MONGO_URI] || get(Config.MONGO_URI);
  private environmentHosting: string = process.env.NODE_ENV || 'dev';

  get(name: string): string {
    return process.env[name] || get(name);
  }

  get isDevelopment(): boolean {
    return this.environmentHosting === 'dev';
  }
}
