// src/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import your JWT guard
import { RolesGuard } from '../auth/roles.guard'; // Import your Roles guard
import { Roles } from '../auth/roles.decorator'; // Import your Roles decorator
import { User } from '../auth/entities/user.entity'; // Import the dashboard User entity for typing

@Controller('dashboard')
export class DashboardController {
  constructor() {} // No services injected for now, just demonstrating protection

  @UseGuards(JwtAuthGuard) // This route requires a valid JWT token
  @Get('profile')
  getProfile(@Request() req: { user: User }) {
    // req.user will contain the authenticated user object (from JwtStrategy's validate method)
    return {
      message: `Welcome to your dashboard, ${req.user.username}!`,
      user: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
      },
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Requires valid JWT AND specific role
  @Roles('admin') // Only users with the 'admin' role can access this route
  @Get('admin-data')
  getAdminData(@Request() req: { user: User }) {
    return {
      message: `Hello Admin ${req.user.username}! This is sensitive admin data.`,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Requires valid JWT AND specific role
  @Roles('user') // Only users with the 'user' role can access this route
  @Get('user-data')
  getUserData(@Request() req: { user: User }) {
    return {
      message: `Hello User ${req.user.username}! This is general user data.`,
    };
  }

  // You can optionally add a route to test Unauthorized access
  @Get('public-info')
  getPublicInfo() {
    return { message: 'This information is publicly accessible.' };
  }
}
