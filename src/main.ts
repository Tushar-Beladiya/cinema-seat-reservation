import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from './validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that are not defined in the DTO
      forbidNonWhitelisted: true, // throws an error if non-whitelisted properties are passed
      transform: true, // automatically transforms payloads to DTO instances
      skipMissingProperties: false,
    }),
  );

  app.enableCors({
    credentials: true,
    origin: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  // Validation

  await app.listen(process.env.PORT || 4040);
}
bootstrap();
