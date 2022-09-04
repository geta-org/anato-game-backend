import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatePipe, RegisterPipe } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('authenticate')
  @HttpCode(202)
  async authenticate(@Body() body: AuthenticatePipe) {
    return await this.authService.authenticate(body);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: RegisterPipe) {
    return this.authService.register(body);
  }
}
