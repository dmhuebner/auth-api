import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  root(): string {
    return 'Auth API is up and running';
  }
}
