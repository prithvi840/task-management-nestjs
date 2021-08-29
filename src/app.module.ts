import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const isProd = config.get('STAGE') === 'prod';
        return {
          ssl: isProd,
          extra: {
            ssl: isProd ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: false,
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          migrationsRun: config.get('MIGRATION_RUN'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          migrations: ['dist/migrations/*{.ts,.js}'],
          logging: true,
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   autoLoadEntities: true,
    //   synchronize: false,
    // }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
