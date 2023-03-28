import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { IConfig } from './config/configuration';
import { CheckLoginMiddleware } from './middleware/checkLogin.middleware';
import { HttpExceptionFilter } from './middleware/httpException.filter';
import { SessionMiddleware } from './middleware/session.middlreware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const redisConfig = configService.get<IConfig['redis']>('redis');
  app.use(SessionMiddleware(redisConfig));
  app.use(CheckLoginMiddleware(app));
  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('todo-serve')
    .setDescription('接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/doc', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
