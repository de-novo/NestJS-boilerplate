import * as winston from 'winston';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { Aplication } from './server';
async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new Aplication(server);
  await app.boostrap();
  app.startLog();
}

init().catch((err) => {
  new Logger('init').error(err);
});
