import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../database';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey: string | undefined = request.headers['x-partner-key'];
    const apiSecret: string | undefined = request.headers['x-partner-secret'];

    if (!apiKey || !apiSecret) {
      throw new UnauthorizedException('Missing partner API credentials');
    }

    const cred = await this.prisma.partnerApiCredential.findFirst({
      where: { apiKey, apiSecret, isActive: true },
      include: { user: true },
    });

    if (!cred) {
      throw new UnauthorizedException('Invalid partner API credentials');
    }

    if (cred.user.role !== 'PARTNER') {
      throw new ForbiddenException('Only partners may access this resource');
    }

    request.partnerUser = { id: cred.userId };
    return true;
  }
}


