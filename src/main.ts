
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exception/global-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));
  app.useGlobalFilters(new GlobalExceptionFilter())
  await app.listen(process.env.APP_PORT);
}
bootstrap();