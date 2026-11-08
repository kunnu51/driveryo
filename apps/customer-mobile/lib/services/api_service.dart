import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';
import '../models/booking_model.dart';

class CustomerApiService {
  static final CustomerApiService _instance = CustomerApiService._internal();
  factory CustomerApiService() => _instance;
  CustomerApiService._internal();

  // Android emulator uses 10.0.2.2, iOS simulator uses 127.0.0.1
  static String get defaultBaseUrl {
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:4000/api/v1';
      }
    } catch (_) {}
    return 'http://127.0.0.1:4000/api/v1';
  }

  String baseUrl = defaultBaseUrl;
  String? authToken;
  UserModel? currentUser;

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (authToken != null) 'Authorization': 'Bearer $authToken',
      };

  Future<Map<String, dynamic>> requestOtp(String phone) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/auth/request-otp'),
        headers: _headers,
        body: jsonEncode({'phone': phone}),
      );
      return jsonDecode(res.body);
    } catch (e) {
      // Local fallback for offline simulation
      return {'success': true, 'testOtp': '5555', 'offline': true};
    }
  }

  Future<Map<String, dynamic>> verifyOtp(String phone, String code) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/auth/verify-otp'),
        headers: _headers,
        body: jsonEncode({'phone': phone, 'code': code}),
      );
      final data = jsonDecode(res.body);
      if (res.statusCode == 200 && data['accessToken'] != null) {
        authToken = data['accessToken'];
        currentUser = UserModel.fromJson(data['user'] ?? {}, token: authToken);
      }
      return data;
    } catch (e) {
      if (code == '5555') {
        authToken = 'jwt_offline_token_customer';
        currentUser = UserModel(id: 'usr_local_01', phone: phone, role: 'CUSTOMER');
        return {'success': true, 'accessToken': authToken, 'user': currentUser!.toJson()};
      }
      return {'error': 'Network error and invalid code'};
    }
  }

  Future<Map<String, dynamic>> estimateFare({
    required String serviceCategory,
    double durationHours = 2.0,
    String? promoCode,
    String vehicleTransmission = 'MANUAL',
    String vehicleCategory = 'SEDAN',
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/pricing/estimate'),
        headers: _headers,
        body: jsonEncode({
          'serviceCategory': serviceCategory,
          'durationHours': durationHours,
          'promoCode': promoCode ?? '',
          'vehicleTransmission': vehicleTransmission,
          'vehicleCategory': vehicleCategory,
        }),
      );
      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
    } catch (_) {}

    // Accurate fallback rate calculation
    int base = 349;
    int inc = 2;
    int hourly = 149;
    if (serviceCategory == 'SCHEDULED') { base = 399; }
    else if (serviceCategory == 'DAILY') { base = 1199; inc = 8; hourly = 129; }
    else if (serviceCategory == 'OUTSTATION') { base = 1899; inc = 12; hourly = 159; }

    int extra = (durationHours > inc) ? ((durationHours - inc) * hourly).round() : 0;
    int subtotal = base + extra;
    int discount = (promoCode == 'FIRSTTRIP' || promoCode == 'HYD100') ? 100 : 0;
    int taxable = (subtotal - discount).clamp(0, 999999);
    int gst = (taxable * 0.18).round();
    return {
      'baseFare': base,
      'extraHoursFare': extra,
      'discount': discount,
      'taxable': taxable,
      'gst': gst,
      'total': taxable + gst,
      'currency': 'INR',
    };
  }

  Future<BookingModel> createBooking({
    required String customerPhone,
    required String pickupLocation,
    required String destinationLocation,
    required String serviceCategory,
    double durationHours = 2.0,
    String vehicleTransmission = 'MANUAL',
    String vehicleCategory = 'SEDAN',
    String? promoCode,
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/bookings/create'),
        headers: _headers,
        body: jsonEncode({
          'customerPhone': customerPhone,
          'pickupLocation': pickupLocation,
          'destinationLocation': destinationLocation,
          'serviceCategory': serviceCategory,
          'durationHours': durationHours,
          'vehicleTransmission': vehicleTransmission,
          'vehicleCategory': vehicleCategory,
          'promoCode': promoCode ?? '',
        }),
      );
      if (res.statusCode == 201 || res.statusCode == 200) {
        return BookingModel.fromJson(jsonDecode(res.body));
      }
    } catch (_) {}

    // Offline simulation booking entity
    return BookingModel(
      id: 'DRV-${DateTime.now().millisecondsSinceEpoch % 1000000}',
      bookingNumber: 'DY-${DateTime.now().millisecondsSinceEpoch % 1000000}',
      customerPhone: customerPhone,
      pickupLocation: pickupLocation,
      destinationLocation: destinationLocation,
      serviceCategory: serviceCategory,
      durationHours: durationHours,
      vehicleTransmission: vehicleTransmission,
      vehicleCategory: vehicleCategory,
      otpStartCode: '7821',
      status: 'ASSIGNED',
      estimatedFare: 412.0,
      assignedDriver: {
        'id': 'drv_hyd_101',
        'fullName': 'Ramesh Reddy',
        'phone': '+919848011223',
        'rating': 4.9,
        'totalTrips': 342,
      },
    );
  }

  Future<BookingModel?> getBooking(String bookingId) async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/bookings/$bookingId'), headers: _headers);
      if (res.statusCode == 200) {
        return BookingModel.fromJson(jsonDecode(res.body));
      }
    } catch (_) {}
    return null;
  }

  Future<bool> rateTrip(String bookingId, int rating, String reviewText) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/trips/$bookingId/rate'),
        headers: _headers,
        body: jsonEncode({'rating': rating, 'reviewText': reviewText}),
      );
      return res.statusCode == 200;
    } catch (_) {
      return true;
    }
  }

  Future<Map<String, dynamic>> createPaymentOrder(String bookingId, double amount) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/payments/create-order'),
        headers: _headers,
        body: jsonEncode({'bookingId': bookingId, 'amount': amount}),
      );
      return jsonDecode(res.body);
    } catch (_) {
      return {
        'orderId': 'order_sim_${DateTime.now().millisecondsSinceEpoch}',
        'amount': (amount * 100).toInt(),
        'currency': 'INR',
        'keyId': 'rzp_test_DRIVERYO_HYD_KEY',
      };
    }
  }

  Future<bool> verifyPayment(String orderId, String paymentId, String signature) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/payments/verify'),
        headers: _headers,
        body: jsonEncode({
          'razorpayOrderId': orderId,
          'razorpayPaymentId': paymentId,
          'razorpaySignature': signature,
        }),
      );
      return res.statusCode == 200;
    } catch (_) {
      return true;
    }
  }
}
