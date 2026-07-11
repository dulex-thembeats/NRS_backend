import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { CurrentUser } from "../../common/decorators";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";

@ApiTags("Dashboard")
@Controller("api/v1/dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("summary")
  @ApiOperation({ summary: "Get dashboard summary based on user role" })
  @ApiResponse({
    status: 200,
    description: "Dashboard summary retrieved successfully",
  })
  async getSummary(@CurrentUser() user: any) {
    const userRole = user.role;

    if (userRole === "TENANT") {
      return this.dashboardService.getTenantDashboardSummary(user.id);
    } else if (userRole === "ADMIN") {
      return this.dashboardService.getAdminDashboardSummary();
    } else {
      // Regular user - get invoice dashboard
      return this.dashboardService.getDashboardSummary(user.id);
    }
  }

  // @Get('tenant')
  // @ApiOperation({ summary: 'Get tenant-specific dashboard' })
  // @ApiResponse({ status: 200, description: 'Tenant dashboard retrieved successfully' })
  // async getTenantDashboard(@CurrentUser() user: any) {
  //   const userRole = (user as any).role;
  //   if (userRole !== 'TENANT') {
  //     throw new ForbiddenException('Only tenants can access this endpoint');
  //   }
  //   return this.dashboardService.getTenantDashboardSummary(user.id);
  // }

  // @Get('admin')
  // @ApiOperation({ summary: 'Get admin dashboard with system-wide statistics' })
  // @ApiResponse({ status: 200, description: 'Admin dashboard retrieved successfully' })
  // async getAdminDashboard(@CurrentUser() user: any) {
  //   const userRole = (user as any).role;
  //   if (userRole !== 'ADMIN') {
  //     throw new ForbiddenException('Only admins can access this endpoint');
  //   }
  //   return this.dashboardService.getAdminDashboardSummary();
  // }
}
