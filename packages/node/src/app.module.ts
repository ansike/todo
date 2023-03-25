import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule, Routes } from 'nest-router';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { IndexModule } from './core/index/index.module';
import { UserModule } from './core/user/user.module';
import Configuration from './config/configuration';
import { User } from './core/user/user.entity';
import { Task } from './core/task/task.entity';
import { TaskModule } from './core/task/task.module';
import { LoggingMiddleware } from './middleware/log.middleware';
import { TaskHistoryModule } from './core/taskHistory/taskHistory.module';
import { TaskHistory } from './core/taskHistory/taskHistory.entity';
import { TaskMember } from './core/task/task.member.entity';

const logger = new Logger('app.module');

export const routes: Routes = [
  {
    path: '/api',
    children: [
      {
        path: '/auth',
        module: AuthModule,
      },
      {
        path: '/user',
        module: UserModule,
      },
      {
        path: '/task',
        module: TaskModule,
      },
      {
        path: '/taskHistory',
        module: TaskHistoryModule,
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
        return { ...config, entities: [User, Task, TaskHistory, TaskMember] };
      },
      inject: [ConfigService],
    }),
    RouterModule.forRoutes(routes),
    UserModule,
    TaskModule,
    TaskHistoryModule,
    AuthModule,
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
