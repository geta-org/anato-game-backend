import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GuardService } from './guard.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(GuardService) private readonly guardService: GuardService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const token = this.guardService.getToken(context);

    try {
      const { id } = this.guardService.decodeToken(token);

      context.getArgs()[0].body = { id };
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          type: 'Unauthorized',
          error: 'Token Is Not Provided',
        },
        401,
      );
    }

    return true;
  }
}
