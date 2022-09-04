import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { User } from './user.entity';
import { DriverError } from './interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      const user = await this.userRepository.insert({
        name,
        email,
        password,
      });

      return { ...user['raw'][0], name, email };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const { constraint, routine }: DriverError = error.driverError;

        // Create a exception for Conflict (StatusCode - 409)
        if (constraint === 'users_email_key' && routine === '_bt_check_unique')
          return { code: 409, message: 'Already Exists' };
      }

      // Create a exception for Bad Request (StatusCode - 406)
      return { code: 400, message: 'Register Account Failed' };
    }
  }

  // Studing a option of enable 'seleted: false' in password
  async getByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
