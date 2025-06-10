// // src/auth/auth.service.ts
// import { Injectable, ConflictException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '@app/quiz/entities/user.entity';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//   ) {}

//   async registerUser(
//     username: string,
//     password: string,
//     fullName: string,
//     phoneNumber?: string,
//   ): Promise<User> {
//     // Added phoneNumber
//     // Check if user already exists
//     const existingUser = await this.usersRepository.findOne({
//       where: { username },
//     });
//     if (existingUser) {
//       throw new ConflictException('Username already taken.');
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save the new user, including phoneNumber
//     const newUser = this.usersRepository.create({
//       username,
//       password: hashedPassword,
//       fullName,
//       phoneNumber,
//     }); // Added phoneNumber
//     return this.usersRepository.save(newUser);
//   }

//   async findOne(username: string): Promise<User | undefined> {
//     return this.usersRepository.findOne({ where: { username } });
//   }
// }

// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common'; // Add UnauthorizedException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@app/quiz/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // <-- Add this import

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService, // <-- Inject JwtService
  ) {}

  async registerUser(
    username: string,
    password: string,
    fullName: string,
    phoneNumber?: string,
  ): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username already taken.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      fullName,
      phoneNumber,
    });
    return this.usersRepository.save(newUser);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  // <-- ADD THIS NEW METHOD FOR SIGN-IN
  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // If credentials are valid, generate JWT token
    const payload = { username: user.username, sub: user.id }; // sub is standard for subject (user ID)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  // END NEW METHOD -->
}
