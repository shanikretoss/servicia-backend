import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { TenantService } from '../tenant.service';
import { TenantContextHelper } from '../helpers/tenant-context.helper';

@Injectable()
export class CompanyContextGuard implements CanActivate {
  constructor(private readonly tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Extract companyId
    const companyId = TenantContextHelper.extractCompanyId(request);
    if (!companyId) {
      throw new BadRequestException('x-company-id header is required');
    }

    // 2. Extract authenticated user (normally attached by JwtAuthGuard)
    const user = request.user;
    if (!user || !user.userId) {
      throw new UnauthorizedException('Authentication required');
    }

    // 3. Resolve tenant context and validate access
    const { company, membership } = await this.tenantService.resolveTenantContext(
      user.userId,
      companyId,
    );

    // 4. Attach resolved contexts to request
    request.company = company;
    request.membership = membership;

    return true;
  }
}
