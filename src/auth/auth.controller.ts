// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  // UnauthorizedException, // This is not needed here as the service throws it
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../quiz/dto/register.dto'; // <-- Import your RegisterDto
import { LoginDto } from '../quiz/dto/login.dto'; // <-- Import your LoginDto

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  // Change to accept the RegisterDto object
  async signUp(@Body() registerDto: RegisterDto) {
    // Pass the DTO object directly to the service method
    const user = await this.authService.registerUser(registerDto);
    const { password: _, ...result } = user;
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  // Change to accept the LoginDto object
  async login(@Body() loginDto: LoginDto) {
    // Pass the DTO object directly to the service method
    const result = await this.authService.signIn(loginDto);
    return result;
  }
}
