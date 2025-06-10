// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport'; // <-- Add this import
import { JwtModule } from '@nestjs/jwt'; // <-- Add this import
import { User } from '@app/quiz/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy'; // <-- Add this import

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_VERY_STRONG_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy], // <-- Add JwtStrategy here
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
