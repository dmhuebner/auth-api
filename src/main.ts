import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const hostDomain = AppModule.isDev ? `${AppModule.host}:${AppModule.port}` : AppModule.host;
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Auth API Documentation')
    .setVersion(process.env.npm_package_version)
    .setHost(hostDomain.split('//')[1])
    .setSchemes(AppModule.isDev ? 'http' : 'https')
    .setBasePath('/api')
    .addBearerAuth('Authorization', 'header')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);

  app.use('api/docs/swagger.json', (req, res) => {
    res.send(swaggerDoc);
  });

  SwaggerModule.setup('/api/docs', app, swaggerDoc, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true
    }
  });

  app.setGlobalPrefix('api');

  await app.listen(AppModule.port);
}
bootstrap();
