// src/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { User } from '../auth/entities/user.entity';

@Controller('dashboard')
export class DashboardController {
  constructor() {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: User }) {
    return {
      message: `Welcome to your dashboard, ${req.user.username}!`,
      user: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
      },
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin-data')
  getAdminData(@Request() req: { user: User }) {
    return {
      message: `Hello Admin ${req.user.username}! This is sensitive admin data.`,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get('user-data')
  getUserData(@Request() req: { user: User }) {
    return {
      message: `Hello User ${req.user.username}! This is general user data.`,
    };
  }
}
