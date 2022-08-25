import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as expressBasicAuth from 'express-basic-auth';
import * as passport from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({});
  app.use(cookieParser());
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.ADMIN_USER]: process.env.ADMIN_PASSWORD },
    }),
  );
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('service name - API')
        .setDescription('UNI')
        .setVersion('version')
        .build(),
    ),
  );
  app.use(passport.initialize());
  await app.listen(process.env.PORT);
}
bootstrap();
