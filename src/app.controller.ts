import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

// @UseGuards()
@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { Hello: 'World' } {
    return this.appService.getHello();
  }
}
