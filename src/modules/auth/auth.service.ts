import { Inject, Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
// Apply later JWTModule/nestjs
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../../database';
import { AuthenticatePipe, RegisterPipe } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}
  async authenticate(data: AuthenticatePipe) {
    const { email, password } = data;
    const user = await this.userRepository.getByEmail(email);

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
    const user = await this.userRepository.create({
      ...data,
      password: await hash(data.password),
    });

    delete user.password;

    return user;
  }
}
