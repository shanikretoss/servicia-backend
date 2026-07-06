import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MembershipsService } from '../../modules/memberships/memberships.service';
import { RolesService } from '../../modules/roles/roles.service';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

interface RequestUser {
  userId: string;
  email: string;
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly membershipsService: MembershipsService,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Read required permissions from metadata
    const requiredPermissions = this.reflector.getAllAndOverride<
      { module: string; action: string }[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    // No permission requirements — allow through
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user: RequestUser;
      params: Record<string, string>;
      body: Record<string, string>;
      headers: Record<string, string>;
    }>();

    // 2. Resolve authenticated user from JWT (set by JwtAuthGuard)
    const user = request.user;
    if (!user?.userId) {
      throw new UnauthorizedException('Authentication required');
    }

    // 3. Resolve company context from params > body > x-company-id header
    const companyId =
      request.params?.companyId ||
      request.body?.companyId ||
      request.headers?.['x-company-id'];

    if (!companyId) {
      throw new ForbiddenException('Company context is required');
    }

    // 4. Find the user's membership within the resolved company
    const membership = await this.membershipsService.findByUserAndCompany(
      user.userId,
      companyId,
    );

    if (!membership) {
      throw new ForbiddenException('You are not a member of this company');
    }

    // 5. Load the role with all its permissions
    const role = await this.rolesService.findWithPermissions(membership.roleId);

    if (!role) {
      throw new ForbiddenException('Role not found');
    }

    // 6. Flatten the granted permission set
    const grantedPermissions = role.rolePermissions.map((rp) => ({
      module: rp.permission.module,
      action: rp.permission.action,
    }));

    // 7. Verify all required permissions are satisfied
    // A wildcard action '*' satisfies any action requirement on the same module
    const hasAll = requiredPermissions.every((required) =>
      grantedPermissions.some(
        (granted) =>
          granted.module === required.module &&
          (granted.action === '*' || granted.action === required.action),
      ),
    );

    if (!hasAll) {
      throw new ForbiddenException(
        'You do not have the required permissions to access this resource',
      );
    }

    return true;
  }
}
