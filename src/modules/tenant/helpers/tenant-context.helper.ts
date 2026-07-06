import { Request } from 'express';

export class TenantContextHelper {
  /**
   * Helper to extract companyId from headers, parameters, body, or query string
   */
  static extractCompanyId(request: Request): string | null {
    const companyId =
      request.headers?.['x-company-id'] ||
      request.params?.companyId ||
      request.body?.companyId ||
      request.query?.companyId;

    return (companyId as string) || null;
  }
}
