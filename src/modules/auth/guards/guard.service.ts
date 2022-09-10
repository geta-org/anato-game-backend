import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { IDecodedAuthToken } from './guard.interface';

@Injectable()
export class GuardService {
  getToken(context: ExecutionContext) {
    const bearerToken = this.getContext(context).headers?.authorization;

    if (!bearerToken)
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          type: 'Unauthorized',
          error: 'Token Is Not Provided',
        },
        401,
      );

    const [Bearer, token] = bearerToken.split(' ');

    if (!/^Bearer$/i.test(Bearer))
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'Bad Request',
          error: 'Token Is Malformed',
        },
        400,
      );

    return token;
  }

  decodeToken(token: string) {
    try {
      return verify(token, process.env.JWT_SECRET) as IDecodedAuthToken;
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
  }

  getContext(context: ExecutionContext) {
    return context.getArgs()[0];
  }
}
