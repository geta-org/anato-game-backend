import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserPipe {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
