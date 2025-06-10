// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'; // Add UnauthorizedException
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('fullName') fullName: string,
    @Body('phoneNumber') phoneNumber?: string,
  ) {
    const user = await this.authService.registerUser(
      username,
      password,
      fullName,
      phoneNumber,
    );
    const { password: _, ...result } = user;
    return result;
  }

  // <-- ADD THIS NEW ENDPOINT FOR LOGIN
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    // The signIn method handles the validation and token generation
    const result = await this.authService.signIn(username, password);
    return result;
  }
  // END NEW ENDPOINT -->
}
