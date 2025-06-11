// src/auth/jwt.strategy.ts (With debugging logs)
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'YOUR_SECRET_KEY', // <--- THIS SECRET MUST MATCH JWTModule's secret
    });
  }

  async validate(payload: any) {
    console.log('--- Inside JwtStrategy validate method ---');
    console.log('Received payload:', payload);

    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      console.log(
        'Token has expired! Expiration time:',
        payload.exp,
        'Current time:',
        currentTime,
      );
      throw new UnauthorizedException('Token expired');
    } else if (payload.exp) {
      console.log(
        'Token is still valid. Expires at:',
        payload.exp,
        'Current time:',
        currentTime,
      );
    }

    const user = await this.authService.findOne(payload.email); // Or findById(payload.sub) if you prefer

    console.log('User found in DB:', user ? user.email : 'None');

    if (!user) {
      console.log(
        'User not found in DB based on payload email:',
        payload.email,
      );
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;

    console.log('Validated user (without password):', result);
    console.log('--- End JwtStrategy validate method ---');

    return result; // This 'result' object will be attached to req.user
  }
}
