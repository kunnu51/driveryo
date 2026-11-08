# DRIVERYO REST & WebSocket API Specification (v1)

## 1. Base URL & Protocol
- **Base URL**: `https://api.driveryo.com/api/v1` (Local: `http://localhost:4000/api/v1`)
- **Protocol**: HTTPS / RESTful JSON
- **WebSocket Gateway**: `wss://api.driveryo.com/ws` (Local: `ws://localhost:4000/ws`)
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <jwt_access_token>`

---

## 2. API Endpoints Catalog

### 2.1 Authentication & Profile (`/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/request-otp` | Request 6-digit SMS OTP for login/registration (phone number) |
| `POST` | `/auth/verify-otp` | Verify OTP; returns JWT access & refresh token pair |
| `POST` | `/auth/refresh-token` | Rotate refresh token and obtain new access token |
| `POST` | `/auth/admin-login` | Admin login using email & password + optional 2FA |
| `GET` | `/auth/me` | Return current authenticated user profile and roles |
| `POST` | `/auth/logout` | Revoke active refresh token |

### 2.2 Customer & Vehicles (`/customer`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `PUT` | `/customer/profile` | Update customer name, email, emergency contact |
| `GET` | `/customer/vehicles` | List registered customer cars |
| `POST` | `/customer/vehicles` | Register customer car (Make, Model, Year, Transmission, Reg Number) |
| `DELETE` | `/customer/vehicles/:id` | Remove saved car |
| `GET` | `/customer/addresses` | Get saved frequent addresses (Home, Office, etc.) |
| `POST` | `/customer/addresses` | Save new address |

### 2.3 Driver Onboarding & Telemetry (`/driver`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/driver/register` | Driver partner initial signup |
| `POST` | `/driver/documents/upload` | Upload driving license, Aadhaar, PAN, photo |
| `GET` | `/driver/documents` | Get list and verification status of submitted documents |
| `POST` | `/driver/availability/toggle` | Toggle online/offline status |
| `POST` | `/driver/location` | Broadcast current GPS latitude, longitude, and bearing |
| `GET` | `/driver/earnings` | Retrieve daily/weekly earnings summary and trip breakdown |
| `GET` | `/driver/payouts` | List payout history and pending bank transfers |

### 2.4 Pricing Engine (`/pricing`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/pricing/estimate` | Calculate estimated fare breakdown based on pickup, drop, service type, duration, vehicle transmission, and time |
| `GET` | `/pricing/rules/:cityId` | Fetch active rate cards and service types for a city |

### 2.5 Bookings & Dispatch (`/bookings`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/bookings/create` | Create a driver booking (Instant, Scheduled, Daily, Outstation) |
| `GET` | `/bookings/:id` | Get booking details, assigned driver, tracking status |
| `GET` | `/bookings/history` | List customer or driver past and active bookings |
| `POST` | `/bookings/:id/cancel` | Cancel booking (calculates cancellation fee if applicable) |
| `POST` | `/bookings/:id/accept` | Driver accepts dispatched booking offer |
| `POST` | `/bookings/:id/reject` | Driver declines booking offer |

### 2.6 Trips & Execution (`/trips`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/trips/:id/arrive` | Driver signals arrival at customer pickup point |
| `POST` | `/trips/:id/start` | Driver starts trip after verifying customer's 4-digit OTP |
| `POST` | `/trips/:id/complete` | Driver completes trip; backend computes final duration, waiting, night surcharge, and fare |
| `POST` | `/trips/:id/rate` | Customer rates driver (1-5 stars) and submits feedback |

### 2.7 Payments & Razorpay (`/payments`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/payments/create-order` | Create Razorpay Order ID for pending booking fare |
| `POST` | `/payments/verify` | Verify payment signature and mark booking as PAID |
| `POST` | `/payments/webhook` | Process server-to-server Razorpay asynchronous webhooks |

### 2.8 Admin Operations Console (`/admin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/overview` | Real-time KPI metrics (active drivers, ongoing trips, today's GMV) |
| `GET` | `/admin/drivers/pending` | List drivers awaiting KYC document verification |
| `POST` | `/admin/drivers/:id/verify` | Approve or reject driver partner with reason notes |
| `GET` | `/admin/operations/map` | Real-time map feed of all online Hyderabad drivers and active bookings |
| `PUT` | `/admin/pricing/rules/:id` | Update base fares, hourly charges, waiting fees, surcharges |
| `GET` | `/admin/finance/reconciliation`| View Razorpay transactions, driver payouts, and revenue reports |

---

## 3. WebSocket Real-Time Events (`/ws`)

### 3.1 Driver -> Server
- `driver:location:update`: `{ latitude, longitude, bearing, speed }`
- `driver:offer:response`: `{ bookingId, accepted: true/false }`

### 3.2 Server -> Driver
- `driver:offer:new`: `{ bookingId, pickupAddress, distanceKm, estimatedEarnings, timeoutSeconds: 30 }`
- `driver:booking:cancelled`: `{ bookingId, message }`

### 3.3 Server -> Customer
- `customer:driver:assigned`: `{ driver: { fullName, phone, rating, avatarUrl } }`
- `customer:driver:location`: `{ latitude, longitude, etaMinutes }`
- `customer:trip:started`: `{ tripId, startedAt }`
- `customer:trip:completed`: `{ tripId, finalFare, receiptUrl }`
