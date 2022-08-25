import { SuccessInterceptor } from './common/interceptor/success.interceptor';
import {
  Logger,
  ValidationPipe,
  Injectable,
  ClassSerializerInterceptor,

} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as expressBasicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { Reflector } from '@nestjs/core';
import { HttpApiExceptionFilter } from './common/exception/http-api-exception.filter';
import * as expressSession from 'express-session';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export class Aplication {
  private logger = new Logger();
  private DEV_MODE: boolean;
  private PORT: string;
  private corsOriginList: string[];
  private ADMIN_USER: string;
  private ADMIN_PASSWORD: string;

  constructor(private server: NestExpressApplication) {
    this.server = server;

    if (!process.env.ACCESS_TOKEN_SECRET)
      this.logger.error('set "ACCESS_TOKEN_SECRET" env');
    if (!process.env.REFRESH_TOKEN_SECRET)
      this.logger.error('set "REFRESH_TOKEN_SECRET" env');

    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
    this.PORT = process.env.PORT || '5000';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : ['*'];
    this.ADMIN_USER = process.env.ADMIN_USER || 'admin';
    this.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1234';
  }
  private setUpBasicAuth() {
    this.server.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: { [this.ADMIN_USER]: this.ADMIN_PASSWORD },
      }),
    );
  }

  private setUpOpenAPIMidleware() {
    SwaggerModule.setup(
      'docs',
      this.server,
      SwaggerModule.createDocument(
        this.server,
        new DocumentBuilder()
          .setTitle('service name - API')
          .setDescription('UNI')
          .setVersion('version')
          .build(),
      ),
    );
  }

  private setWinstonLogger() {
    this.server.useLogger(this.server.get(WINSTON_MODULE_NEST_PROVIDER));
  }

  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
    });
    this.server.use(
      expressSession({
        secret: 'SECRET',
        resave: true,
        saveUninitialized: true,
      }),
    );
    this.server.setGlobalPrefix('api');

    this.server.use(cookieParser());
    this.setUpBasicAuth();
    this.setUpOpenAPIMidleware();
    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    this.server.use(passport.initialize());
    this.server.use(passport.session());
    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
      new SuccessInterceptor(),
    );

    this.server.useGlobalFilters(new HttpApiExceptionFilter());
  }

  async boostrap() {
    await this.setUpGlobalMiddleware();
    await this.setWinstonLogger();
    await this.server.listen(this.PORT);
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(`✅ Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }
  errorLog(error: string) {
    // this.logger.error(`🆘 Server error ${error}`);
  }
}
// [Nest] 71074  - 2022. 08. 25. 오후 10:21:54   ERROR [HttpApiExceptionFilter] Object:
// {
//   "err": 123
// }
