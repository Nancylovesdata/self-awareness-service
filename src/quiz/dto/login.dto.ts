import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string; // <-- MUST HAVE THIS

  @IsString()
  @IsNotEmpty()
  password: string;
}
