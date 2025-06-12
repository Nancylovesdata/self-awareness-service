// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { User } from './entities/user.entity'; // Import the dashboard User entity

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles from the @Roles() decorator applied to the handler
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are specified, the route is public (or only needs JwtAuthGuard)
    if (!requiredRoles) {
      return true;
    }

    // Get the user from the request (attached by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    // Check if the user exists and their role is included in the requiredRoles
    // Make sure user.role matches one of the required roles
    return requiredRoles.some((role) => user.role === role);
  }
}
