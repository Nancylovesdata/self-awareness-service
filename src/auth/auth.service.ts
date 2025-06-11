// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../quiz/entities/user.entity'; // Adjust path if @app/quiz/entities/user.entity is correct
import { RegisterDto } from '../quiz/dto/register.dto';
import { LoginDto } from '../quiz/dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegisterDto): Promise<User> {
    const { email, password, fullName, phoneNumber } = registerDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already taken.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      fullName,
      phoneNumber,
    });
    const savedUser = await this.usersRepository.save(newUser);

    // It's good practice to not return the password hash
    delete savedUser.password;
    return savedUser; // <-- RETURN ADDED HERE
  }

  // --- ADD THIS findOne METHOD ---
  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }
  // -------------------------------

  async signIn(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Generate JWT payload
    const payload = {
      email: user.email,
      sub: user.id, // Subject often refers to the user ID
      fullName: user.fullName,
      // You can add more data to the payload if needed
    };

    return {
      access_token: this.jwtService.sign(payload), // <-- RETURN ADDED HERE
    };
  }
}
