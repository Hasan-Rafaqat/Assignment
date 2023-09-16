import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
9;

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
