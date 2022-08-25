import { Injectable, HttpException } from '@nestjs/common';
import { SuccessInterceptor } from './common/interceptor/success.interceptor';

@Injectable()
export class AppService {
  getHello(): string {
    throw new HttpException({ err: 123 }, 404);
    return 'Hello World!';
  }
}
