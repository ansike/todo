import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule, Routes } from 'nest-router';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestModule } from './core/test/test.module';
import { IndexModule } from './core/index/index.module';
import { UserModule } from './core/user/user.module';
import Configuration from './config/configuration';
import { User } from './core/user/user.entity';
import { Task } from './core/task/task.entity';
import { TaskModule } from './core/task/task.module';
import { LoggingMiddleware } from './middleware/log.middleware';

const logger = new Logger('app.module');

export const routes: Routes = [
  {
    path: '/api',
    children: [
      {
        path: '/test',
        module: TestModule,
      },
      {
        path: '/user',
        module: UserModule,
      },
      {
        path: '/task',
        module: TaskModule,
      },
    ],
  },
  {
    path: '*',
    module: IndexModule,
  },
];

const getEnvFile = () => {
  if (process.env.NODE_ENV === 'production') return ['.env'];
  return ['.development.env'];
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration],
      envFilePath: getEnvFile(),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get('mysql');
        logger.log(`mysql config host:${config.host} port:${config.port} username: ${config.username}`);
        logger.debug(`mysql config password: ${JSON.stringify(config.password)}`);
        return { ...config, entities: [User, Task] };
      },
      inject: [ConfigService],
    }),
    RouterModule.forRoutes(routes),
    UserModule,
    TaskModule,
    TestModule,
    IndexModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
  }
}
