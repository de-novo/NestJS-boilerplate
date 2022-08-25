import { Controller, Get, Param, LoggerService, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get(':id')
  getHI(@Param('id') id: number): object {
    console.log(typeof id);
    return { name: 'dg', age: 2 };
  }
}
