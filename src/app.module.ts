import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

//options
import { configOption } from './common/options/config.option';
import { typeOrmOptions } from './common/options/typeOrm.option';

import { WinstonModule } from 'nest-winston';
import { winstonModuleAsyncOptions } from './common/options/winston.option';
@Module({
  imports: [
    ConfigModule.forRoot(configOption),
    TypeOrmModule.forRootAsync(typeOrmOptions),
    WinstonModule.forRootAsync(winstonModuleAsyncOptions),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
