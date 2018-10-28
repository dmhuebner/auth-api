import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ConfigService } from './shared/config/config.service';
import { Config } from './shared/config/config.enum';

@Module({
  imports: [SharedModule, MongooseModule.forRoot(ConfigService.connectionString)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  static host: string;
  static port: number | string;
  static isDev: boolean;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = AppModule.normalizePort(configService.get(Config.PORT));
    AppModule.host = configService.get(Config.HOST);
    AppModule.isDev = configService.isDevelopment;
  }

  private static normalizePort(port: number | string): number | string {
    const portNumber: number = typeof port === 'string' ? parseInt(port, 10) : port;

    if (isNaN(portNumber)) {
      return port;
    } else if (portNumber >= 0) {
      return portNumber;
    }
  }
}
