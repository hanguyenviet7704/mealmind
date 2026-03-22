import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix: /api/v1
  app.setGlobalPrefix('api/v1');

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('MealMind API')
    .setDescription('Personalized Meal Suggestion API for Vietnamese families')
    .setVersion('1.0')
    .addTag('auth', 'Authentication and Authorization')
    .addTag('users', 'User Profiles and Multi-family Management')
    .addTag('recipes', 'Recipe Management and Search')
    .addTag('suggestions', 'AI-powered Meal Suggestions')
    .addTag('planning', 'Weekly Meal Planning')
    .addTag('nutrition', 'Nutrition Tracking and Goals')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'MealMind API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
    },
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🍽️  MealMind API running on http://localhost:${port}/api/v1`);
}

bootstrap();
