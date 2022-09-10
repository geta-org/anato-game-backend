import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database';
import { GuardModule } from '../auth/guards';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, GuardModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
