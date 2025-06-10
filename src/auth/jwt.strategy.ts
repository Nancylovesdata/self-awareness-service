// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service'; // To validate user if needed

// Define the payload interface for your JWT token
export interface JwtPayload {
  username: string;
  sub: number; // User ID
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Inject AuthService if you need to fetch user from DB
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization: Bearer <token>
      ignoreExpiration: false, // Do not ignore token expiration
      secretOrKey: 'YOUR_VERY_STRONG_SECRET_KEY', // <-- MUST MATCH THE SECRET IN AuthModule
    });
  }

  async validate(payload: JwtPayload) {
    // This method is called after the token is verified (signature, expiration)
    // You can fetch the user from the database here to ensure they still exist
    const user = await this.authService.findOne(payload.username);
    if (!user) {
      // You could throw an UnauthorizedException here
      return null; // Or return false, Passport will handle authentication failure
    }
    // If validation is successful, the payload will be attached to req.user
    // It's good practice to return a subset of the user object, e.g., userId and username
    return {
      userId: payload.sub,
      username: payload.username,
      fullName: user.fullName,
    }; // Return what you want in req.user
  }
}
