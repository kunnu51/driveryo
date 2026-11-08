// @driveryo/api-client
// Universal HTTP & WebSocket client for Driveryo Frontend and Admin

class DriveryoApiClient {
  constructor({ baseUrl = 'http://localhost:4000/api/v1', getAuthToken = () => null } = {}) {
    this.baseUrl = baseUrl;
    this.getAuthToken = getAuthToken;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const config = {
      ...options,
      headers
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
      throw err;
    }
  }

  // --- Auth Endpoints ---
  async requestOtp(phone) {
    return this.request('/auth/request-otp', { method: 'POST', body: { phone } });
  }

  async verifyOtp(phone, otp) {
    return this.request('/auth/verify-otp', { method: 'POST', body: { phone, otp } });
  }

  async adminLogin(email, password) {
    return this.request('/auth/admin-login', { method: 'POST', body: { email, password } });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // --- Pricing Endpoints ---
  async getFareEstimate(params) {
    return this.request('/pricing/estimate', { method: 'POST', body: params });
  }

  async getPricingRules(cityId = 'hyd-telangana-01') {
    return this.request(`/pricing/rules/${cityId}`);
  }

  // --- Bookings Endpoints ---
  async createBooking(bookingData) {
    return this.request('/bookings/create', { method: 'POST', body: bookingData });
  }

  async getBooking(bookingId) {
    return this.request(`/bookings/${bookingId}`);
  }

  async listBookings(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/bookings?${query}`);
  }

  async cancelBooking(bookingId, reason) {
    return this.request(`/bookings/${bookingId}/cancel`, { method: 'POST', body: { reason } });
  }

  // --- Driver Partner Endpoints ---
  async registerDriver(driverData) {
    return this.request('/driver/register', { method: 'POST', body: driverData });
  }

  async uploadDriverKYC(documentData) {
    return this.request('/driver/documents/upload', { method: 'POST', body: documentData });
  }

  async toggleDriverAvailability(isOnline) {
    return this.request('/driver/availability/toggle', { method: 'POST', body: { isOnline } });
  }

  async updateDriverLocation(coords) {
    return this.request('/driver/location', { method: 'POST', body: coords });
  }

  async getDriverEarnings() {
    return this.request('/driver/earnings');
  }

  // --- Trips Endpoints ---
  async arriveAtPickup(tripId) {
    return this.request(`/trips/${tripId}/arrive`, { method: 'POST' });
  }

  async startTrip(tripId, otp) {
    return this.request(`/trips/${tripId}/start`, { method: 'POST', body: { otp } });
  }

  async completeTrip(tripId) {
    return this.request(`/trips/${tripId}/complete`, { method: 'POST' });
  }

  async rateTrip(tripId, ratingData) {
    return this.request(`/trips/${tripId}/rate`, { method: 'POST', body: ratingData });
  }

  // --- Admin Console Endpoints ---
  async getAdminOverview() {
    return this.request('/admin/overview');
  }

  async getPendingDrivers() {
    return this.request('/admin/drivers/pending');
  }

  async verifyDriver(driverId, { approved, reasonNotes }) {
    return this.request(`/admin/drivers/${driverId}/verify`, {
      method: 'POST',
      body: { approved, reasonNotes }
    });
  }

  async getOperationsLiveFeed() {
    return this.request('/admin/operations/map');
  }

  async updatePricingRule(ruleId, ruleData) {
    return this.request(`/admin/pricing/rules/${ruleId}`, { method: 'PUT', body: ruleData });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DriveryoApiClient };
}
