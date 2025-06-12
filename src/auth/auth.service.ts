// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// --- IMPORTANT CHANGE HERE ---
// Import the NEW Dashboard User entity from its correct path
import { User } from './entities/user.entity'; // This is the dashboard user entity
// --- END IMPORTANT CHANGE ---

// --- IMPORTANT CHANGE HERE ---
// Import DTOs from the new 'src/auth/dto' folder
import { RegisterDto } from '../quiz/dto/register.dto';
import { LoginDto } from '../quiz/dto/login.dto';
// --- END IMPORTANT CHANGE ---

// Use bcrypt (the one we installed) for consistency and potential native performance
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) // This now refers to the Dashboard User entity
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Renamed to register for dashboard users, using username and role
  async register(registerDto: RegisterDto): Promise<User> {
    const { username, password, role } = registerDto; // Now expects username and role

    const existingUser = await this.usersRepository.findOne({
      where: { username }, // Check by username
    });
    if (existingUser) {
      throw new ConflictException('Username already taken.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if not provided
    });
    const savedUser = await this.usersRepository.save(newUser);

    // It's good practice to not return the password hash
    delete savedUser.password;
    return savedUser;
  }

  // This method will be used by JwtStrategy to validate the user from token payload
  async validateUser(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  // Renamed to login for dashboard users, using username
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    // Changed access_token to accessToken for consistency with NestJS JWT common practice
    const { username, password } = loginDto; // Now expects username
    const user = await this.usersRepository.findOne({ where: { username } }); // Find by username

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Generate JWT payload for dashboard user
    const payload = {
      username: user.username,
      sub: user.id, // Subject refers to the user ID
      role: user.role, // Include role in the payload for authorization
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
