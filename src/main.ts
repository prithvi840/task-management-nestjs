import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger('App');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe()); // whenever encounter validation `decorators` triggers the validation
  app.useGlobalInterceptors(new TransformInterceptor());
  const PORT = process.env.PORT;
  await app.listen(PORT);
  logger.log(`App listening on port: ${PORT}`);
}

bootstrap();
