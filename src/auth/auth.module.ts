// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// --- IMPORTANT CHANGE HERE ---
// Import the NEW Dashboard User entity from its correct path within the auth module
import { User } from './entities/user.entity';
// --- END IMPORTANT CHANGE ---
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // This now registers the Dashboard User entity
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Make sure ConfigModule is available to use ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Retrieve JWT_SECRET from environment variables
        signOptions: { expiresIn: '60m' }, // Token expiration
      }),
      inject: [ConfigService],
    }),
    // --- IMPORTANT NOTE ON CONFIGMODULE ---
    // If you already have ConfigModule.forRoot({ isGlobal: true }) in your AppModule,
    // you should REMOVE this line from here:
    // ConfigModule.forRoot({ isGlobal: true }),
    // Just 'ConfigModule' (without .forRoot) is enough if it's global in AppModule.
    // If you don't have it global in AppModule, then leave it here.
    // For now, I'll assume it's correctly placed in AppModule.
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // JwtStrategy is essential here
  exports: [AuthService, JwtModule, PassportModule], // Export services/modules that might be used elsewhere
})
export class AuthModule {}
