import { Body, Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards';
import { GetUserPipe } from './interfaces/';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  async getUser(@Body() body: GetUserPipe) {
    return { Hello: 'User', body };
  }
}
