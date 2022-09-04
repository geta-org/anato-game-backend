import { Inject, Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { UserService } from '../user';
import { sign } from 'jsonwebtoken';
import { AuthenticatePipe, RegisterPipe } from './interfaces';

@Injectable()
export class AuthService {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  async authenticate(data: AuthenticatePipe) {
    const { email, password } = data;

    const user = await this.userService.getByEmail(email);

    // Do not return the type of error (Security)
    // { code: 401, message: 'Invalid Password' };
    // { code: 404, message: 'This User Does Not Exist' };
    if (!user || !(await verify(user.password, password)))
      return { code: 401, message: 'Credentials Incorrect' };

    const { id } = user;

    const token = sign({ id }, process.env.JWT_SECRET, {
      expiresIn: 43200,
    });

    return { user, token };
  }

  async register(data: RegisterPipe) {
    const user = await this.userService.create({
      ...data,
      password: await hash(data.password),
    });

    return user;
  }
}
