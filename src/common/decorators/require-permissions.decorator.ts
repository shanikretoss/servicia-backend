import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'requiredPermissions';

/**
 * Decorator to declare required permissions on a controller or method.
 * Usage: @RequirePermissions({ module: 'users', action: '*' })
 */
export const RequirePermissions = (
  ...permissions: { module: string; action: string }[]
) => SetMetadata(PERMISSIONS_KEY, permissions);
