import { Injectable } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service';
import { DriversService } from '../drivers/drivers.service';
import { MatchingService } from '../matching/matching.service';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class AdminService {
  private customers = [
    {
      id: 'cust_01',
      fullName: 'Vikram Reddy',
      phone: '+919876543210',
      email: 'vikram.reddy@gmail.com',
      totalBookings: 14,
      totalSpend: 7850,
      status: 'ACTIVE',
      referralCode: 'VIKRAMHYD',
      registeredVehicle: 'Hyundai Verna (Sedan - Manual) • TS09FA1234',
      createdAt: '2026-08-15',
    },
    {
      id: 'cust_02',
      fullName: 'Ananya Sharma',
      phone: '+919876543211',
      email: 'ananya.s@outlook.com',
      totalBookings: 8,
      totalSpend: 5420,
      status: 'ACTIVE',
      referralCode: 'ANANYA99',
      registeredVehicle: 'Honda City (Sedan - Automatic) • TS08EA5678',
      createdAt: '2026-09-02',
    },
    {
      id: 'cust_03',
      fullName: 'Dr. K. Srinivas',
      phone: '+919876543212',
      email: 'dr.srinivas@apollo.com',
      totalBookings: 22,
      totalSpend: 28400,
      status: 'ACTIVE',
      referralCode: 'SRINIVASDOC',
      registeredVehicle: 'Toyota Fortuner (SUV - Automatic) • TS07GA9900',
      createdAt: '2026-07-20',
    },
  ];

  private tickets = [
    {
      id: 'tkt_01',
      ticketNumber: 'TKT-1082',
      customerName: 'Vikram Reddy',
      customerPhone: '+919876543210',
      subject: 'Chauffeur arrived 5 mins late due to Outer Ring Road traffic',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      resolutionNotes: 'Issued ₹100 courtesy coupon FIRSTTRIP to customer wallet.',
      createdAt: '2026-11-06T14:20:00Z',
    },
    {
      id: 'tkt_02',
      ticketNumber: 'TKT-1095',
      customerName: 'Ananya Sharma',
      customerPhone: '+919876543211',
      subject: 'Request invoice copy with GSTIN for company tax reimbursement',
      priority: 'LOW',
      status: 'OPEN',
      resolutionNotes: null,
      createdAt: '2026-11-07T09:15:00Z',
    },
  ];

  private corporateAccounts = [
    {
      id: 'corp_01',
      companyName: 'Cyber Towers Tech Labs Pvt Ltd',
      gstin: '36AAACC1234F1Z5',
      contactPerson: 'Rajesh Varma',
      contactEmail: 'rajesh.v@cybertech.com',
      creditLimit: 100000,
      outstandingAmount: 24500,
      status: 'ACTIVE',
      activeEmployees: 42,
    },
    {
      id: 'corp_02',
      companyName: 'GVK Bio Science Campus',
      gstin: '36AABBG9876K1Z2',
      contactPerson: 'Lakshmi Nair',
      contactEmail: 'lakshmi.n@gvkbio.com',
      creditLimit: 150000,
      outstandingAmount: 18200,
      status: 'ACTIVE',
      activeEmployees: 68,
    },
  ];

  private auditLogs = [
    { id: 'log_01', action: 'DRIVER_APPROVED', actor: 'admin@driveryo.com', entity: 'DriverProfile', entityId: 'drv_app_201', timestamp: '2026-11-07T12:05:00Z' },
    { id: 'log_02', action: 'PRICING_UPDATED', actor: 'admin@driveryo.com', entity: 'PricingRule', entityId: 'INSTANT', timestamp: '2026-11-07T10:30:00Z' },
    { id: 'log_03', action: 'BATCH_PAYOUT_INITIATED', actor: 'finance@driveryo.com', entity: 'Payout', entityId: 'batch_hyd_491', timestamp: '2026-11-07T08:00:00Z' },
  ];

  constructor(
    private readonly bookingsService: BookingsService,
    private readonly driversService: DriversService,
    private readonly matchingService: MatchingService,
    private readonly pricingService: PricingService,
  ) {}

  getOverviewStats() {
    const fleet = this.matchingService.getAllFleet();
    const bookings = this.bookingsService.listBookings();
    const pendingDrivers = this.driversService.getPendingApplications();

    const completedBookings = bookings.filter((b) => b.status === 'TRIP_COMPLETED');
    const totalGMV = completedBookings.reduce((sum, b) => sum + (b.fareBreakdown?.total || 0), 48500);
    const platformCommission = Math.round(totalGMV * 0.2);

    return {
      totalCustomers: this.customers.length + 12450,
      totalDrivers: fleet.length + pendingDrivers.length + 1500,
      verifiedDrivers: 1485,
      onlineDrivers: fleet.filter((d) => d.isOnline).length,
      pendingDriverApprovals: pendingDrivers.length,
      totalBookings: bookings.length + 3280,
      completedBookings: completedBookings.length + 3120,
      cancelledBookings: 84,
      totalGMV,
      platformCommission,
      pendingPayouts: 34200,
      openComplaints: this.tickets.filter((t) => t.status === 'OPEN').length,
      activeCorporateAccounts: this.corporateAccounts.length,
      city: 'Hyderabad',
      activeZoneCount: 8,
    };
  }

  getLiveOperationsMap() {
    return {
      city: 'Hyderabad',
      center: { latitude: 17.385044, longitude: 78.486671 },
      drivers: this.matchingService.getAllFleet().map((d) => ({
        id: d.id,
        name: d.fullName,
        phone: d.phone,
        latitude: d.latitude,
        longitude: d.longitude,
        rating: d.rating,
        status: d.isBusy ? 'ON_TRIP' : 'ONLINE_AVAILABLE',
        transmission: d.transmission,
      })),
      activeBookings: this.bookingsService.listBookings().map((b) => ({
        id: b.id,
        bookingNumber: b.bookingNumber,
        pickup: b.pickupLocation,
        destination: b.destinationLocation,
        customerPhone: b.customerPhone,
        driverName: b.assignedDriver?.fullName,
        status: b.status,
        transmission: b.vehicleTransmission,
        estimatedFare: b.fareBreakdown?.total || 412,
      })),
    };
  }

  getCustomers() {
    return this.customers;
  }

  toggleCustomerStatus(customerId: string) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (cust) {
      cust.status = cust.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
      this.recordAuditLog('CUSTOMER_STATUS_CHANGED', `Customer ${cust.fullName} status set to ${cust.status}`);
      return { success: true, customer: cust };
    }
    return { success: false, error: 'Customer not found' };
  }

  getPendingDrivers() {
    return this.driversService.getPendingApplications();
  }

  getAllDrivers() {
    const active = this.matchingService.getAllFleet();
    const pending = this.driversService.getPendingApplications();
    return [...active, ...pending];
  }

  verifyDriver(id: string, approved: boolean, reasonNotes?: string) {
    const res = this.driversService.verifyDriver(id, approved, reasonNotes);
    this.recordAuditLog(
      approved ? 'DRIVER_APPROVED' : 'DRIVER_REJECTED',
      `Driver KYC application ${id} was ${approved ? 'approved' : 'rejected'}: ${reasonNotes || 'Standard check'}`,
    );
    return res;
  }

  manualAllocateDriver(bookingId: string, driverId: string) {
    const fleet = this.matchingService.getAllFleet();
    const driver = fleet.find((d) => d.id === driverId);
    if (!driver) return { success: false, error: 'Driver not found' };

    this.recordAuditLog('DRIVER_MANUALLY_ALLOCATED', `Assigned driver ${driver.fullName} to booking ${bookingId}`);
    return {
      success: true,
      bookingId,
      assignedDriver: driver,
      status: 'ASSIGNED',
    };
  }

  getPricingRules() {
    return this.pricingService.getAllRules();
  }

  updatePricingRule(serviceCategory: string, rule: any) {
    this.recordAuditLog('PRICING_UPDATED', `Updated rate card for ${serviceCategory}: base ₹${rule.baseFare}`);
    return { success: true, updatedRule: rule };
  }

  getFinanceOverview() {
    return {
      totalGMV: 48500,
      driverEarnings80Pct: 38800,
      platformCut20Pct: 9700,
      gstCollected18Pct: 7420,
      pendingPayoutsBalance: 14760,
      payoutBatches: [
        { id: 'batch_491', date: '2026-11-04', totalAmount: 89400, driversCount: 48, status: 'PROCESSED' },
        { id: 'batch_492', date: '2026-11-11', totalAmount: 34200, driversCount: 22, status: 'SCHEDULED' },
      ],
    };
  }

  getSupportTickets() {
    return this.tickets;
  }

  resolveSupportTicket(ticketId: string, resolutionNotes: string) {
    const t = this.tickets.find((item) => item.id === ticketId);
    if (t) {
      t.status = 'RESOLVED';
      t.resolutionNotes = resolutionNotes;
      this.recordAuditLog('TICKET_RESOLVED', `Resolved ticket ${t.ticketNumber}: ${resolutionNotes}`);
      return { success: true, ticket: t };
    }
    return { success: false, error: 'Ticket not found' };
  }

  getCorporateAccounts() {
    return this.corporateAccounts;
  }

  getAuditLogs() {
    return this.auditLogs;
  }

  private recordAuditLog(action: string, details: string) {
    this.auditLogs.unshift({
      id: 'log_' + Date.now(),
      action,
      actor: 'admin@driveryo.com',
      entity: 'Operations',
      entityId: details,
      timestamp: new Date().toISOString(),
    });
  }
}
