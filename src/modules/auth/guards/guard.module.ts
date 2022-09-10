import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { GuardService } from './guard.service';

@Module({
  providers: [AuthGuard, GuardService],
  exports: [AuthGuard, GuardService],
})
export class GuardModule {}
