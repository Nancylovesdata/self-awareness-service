// src/auth/auth.module.ts (Ensure this is correct)
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../quiz/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // <-- Double-check this line
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }), // Ensure ConfigModule is set up
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // JwtStrategy is essential here
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
