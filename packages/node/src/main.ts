import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IConfig } from './config/configuration';
import { HttpExceptionFilter } from './middleware/httpException.filter';
import { SessionMiddleware } from './middleware/session.middlreware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const redisConfig = configService.get<IConfig['redis']>('redis');
  app.use(SessionMiddleware(redisConfig));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
