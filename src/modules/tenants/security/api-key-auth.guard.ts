import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../../database";

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey: string | undefined = request.headers["x-tenant-key"];
    const apiSecret: string | undefined = request.headers["x-tenant-secret"];

    if (!apiKey || !apiSecret) {
      throw new UnauthorizedException("Missing tenant API credentials");
    }

    const cred = await this.prisma.tenantApiCredential.findFirst({
      where: { apiKey, apiSecret, isActive: true },
      include: { user: true },
    });

    if (!cred) {
      throw new UnauthorizedException("Invalid tenant API credentials");
    }

    if (cred.user.role !== "TENANT") {
      throw new ForbiddenException("Only tenants may access this resource");
    }

    request.user = { id: cred.userId };
    return true;
  }
}
