// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '../quiz/dto/register.dto';
import { LoginDto } from '../quiz/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) // Dashboard User entity
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Renamed to register for dashboard users, using username and role
  async register(registerDto: RegisterDto): Promise<User> {
    const { username, password, role } = registerDto;

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

  //  JwtStrategy to validate the user from token payload
  async validateUser(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto; // Now expects username
    const user = await this.usersRepository.findOne({ where: { username } });

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
      sub: user.id,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
