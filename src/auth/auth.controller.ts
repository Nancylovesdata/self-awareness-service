// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../quiz/dto/register.dto'; // Ensure correct path
import { LoginDto } from '../quiz/dto/login.dto'; // Ensure correct path

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    // --- CHANGE HERE: Renamed method from registerUser to register ---
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    // --- CHANGE HERE: Renamed method from signIn to login ---
    return this.authService.login(loginDto);
  }
}
