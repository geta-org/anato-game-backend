import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class AuthenticatePipe {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
