import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://vtnews.ai',
      'http://localhost.charlesproxy.com:3000',
      'https://www.my-test-domain.xyz',
      'https://my-test-domain.xyz',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
