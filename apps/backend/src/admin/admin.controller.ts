import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Real-time KPI metrics for Admin Dashboard' })
  async getOverview() {
    return this.adminService.getOverviewStats();
  }

  @Get('operations/map')
  @ApiOperation({ summary: 'Live Hyderabad operations map: driver positions and active trips' })
  async getOperationsMap() {
    return this.adminService.getLiveOperationsMap();
  }

  @Get('customers')
  @ApiOperation({ summary: 'List customer directory with spend and vehicle records' })
  async getCustomers() {
    return this.adminService.getCustomers();
  }

  @Post('customers/:id/toggle-status')
  @ApiOperation({ summary: 'Block or unblock a customer account' })
  async toggleCustomerStatus(@Param('id') id: string) {
    return this.adminService.toggleCustomerStatus(id);
  }

  @Get('drivers')
  @ApiOperation({ summary: 'List all drivers or filter by approval status' })
  async getDrivers() {
    return this.adminService.getAllDrivers();
  }

  @Get('drivers/pending')
  @ApiOperation({ summary: 'List driver partner KYC applications awaiting verification' })
  async getPendingDrivers() {
    return this.adminService.getPendingDrivers();
  }

  @Post('drivers/:id/verify')
  @ApiOperation({ summary: 'Approve or reject a driver KYC application' })
  async verifyDriver(
    @Param('id') id: string,
    @Body() body: { approved?: boolean; action?: string; reasonNotes?: string; reason?: string },
  ) {
    const isApproved = body.approved ?? (body.action === 'APPROVE');
    return this.adminService.verifyDriver(id, isApproved, body.reasonNotes || body.reason);
  }

  @Post('bookings/:id/allocate')
  @ApiOperation({ summary: 'Manually allocate or reassign a driver to an active customer booking' })
  async manualAllocate(@Param('id') id: string, @Body() body: { driverId: string }) {
    return this.adminService.manualAllocateDriver(id, body.driverId);
  }

  @Get('pricing')
  @ApiOperation({ summary: 'Get current pricing configurations & rate cards' })
  async getPricing() {
    return this.adminService.getPricingRules();
  }

  @Post('pricing/:category')
  @ApiOperation({ summary: 'Update rate card parameters for a service category' })
  async updatePricing(@Param('category') category: string, @Body() body: any) {
    return this.adminService.updatePricingRule(category, body);
  }

  @Get('finance/overview')
  @ApiOperation({ summary: 'Get 80/20 commissions, GMV, and payout batch ledger' })
  async getFinanceOverview() {
    return this.adminService.getFinanceOverview();
  }

  @Get('tickets')
  @ApiOperation({ summary: 'List customer complaints and support tickets' })
  async getTickets() {
    return this.adminService.getSupportTickets();
  }

  @Post('tickets/:id/resolve')
  @ApiOperation({ summary: 'Resolve a customer support ticket with resolution notes' })
  async resolveTicket(@Param('id') id: string, @Body() body: { notes: string }) {
    return this.adminService.resolveSupportTicket(id, body.notes);
  }

  @Get('corporate')
  @ApiOperation({ summary: 'List corporate B2B client accounts and credit limits' })
  async getCorporate() {
    return this.adminService.getCorporateAccounts();
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Fetch immutable admin audit logs' })
  async getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
