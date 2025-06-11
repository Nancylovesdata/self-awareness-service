// src/auth/dto/register.dto.ts
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class RegisterDto {
  @IsEmail() // Use IsEmail validator
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
