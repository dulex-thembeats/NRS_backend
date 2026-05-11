import { DashboardService } from "./dashboard.service";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(user: any): Promise<import("./dashboard.service").TenantDashboardSummary | import("./dashboard.service").AdminDashboardSummary | import("./dashboard.service").DashboardSummary>;
}
