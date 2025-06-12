// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // <-- NEW: Import ConfigService
import { AuthService } from './auth.service';

// Define the structure of your JWT payload
interface JwtPayload {
  username: string; // <-- This is what we expect for dashboard users
  sub: number; // User ID
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
// --- IMPORTANT CHANGE: Add 'jwt' as the strategy name ---
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService, // <-- NEW: Inject ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Passport will handle expiration automatically based on 'exp' in payload
      // --- IMPORTANT CHANGE: Get secret from ConfigService ---
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // This method is called after the JWT is validated (signature and expiration)
  // The 'payload' is the decoded JWT payload
  async validate(payload: JwtPayload) {
    // <-- NEW: Use JwtPayload type
    // console.log('--- Inside JwtStrategy validate method ---'); // Debugging - can remove later
    // console.log('Received payload:', payload); // Debugging - can remove later

    // --- REMOVE: Manual expiration check is handled by ignoreExpiration: false ---
    // const currentTime = Date.now() / 1000;
    // if (payload.exp && payload.exp < currentTime) {
    //   console.log('Token has expired!');
    //   throw new UnauthorizedException('Token expired');
    // } else if (payload.exp) {
    //   console.log('Token is still valid.');
    // }
    // --- END REMOVE ---

    // --- IMPORTANT CHANGE: Use authService.validateUser with payload.username ---
    const user = await this.authService.validateUser(payload.username);

    // console.log('User found in DB:', user ? user.username : 'None'); // Debugging - can remove later

    if (!user) {
      // console.log('User not found in DB based on payload username:', payload.username); // Debugging - can remove later
      throw new UnauthorizedException('Invalid token or user not found.');
    }

    // It's good practice to ensure the password hash is not returned with the user object
    // when it's attached to the request.
    delete user.password;

    // console.log('Validated user (without password):', user); // Debugging - can remove later
    // console.log('--- End JwtStrategy validate method ---'); // Debugging - can remove later

    return user; // This 'user' object will be attached to req.user
  }
}
