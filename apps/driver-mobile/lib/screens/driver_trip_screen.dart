import 'package:flutter/material.dart';
import '../services/driver_api_service.dart';

class DriverTripScreen extends StatefulWidget {
  final String bookingId;

  const DriverTripScreen({Key? key, this.bookingId = 'DRV-8942'}) : super(key: key);

  @override
  State<DriverTripScreen> createState() => _DriverTripScreenState();
}

class _DriverTripScreenState extends State<DriverTripScreen> {
  final DriverApiService _apiService = DriverApiService();
  String _step = 'NAVIGATING_TO_PICKUP'; // NAVIGATING_TO_PICKUP, ARRIVED, TRIP_STARTED, COMPLETED
  final TextEditingController _otpController = TextEditingController();
  bool _isLoading = false;
  Map<String, dynamic>? _completionResult;

  void _signalArrival() async {
    setState(() => _isLoading = true);
    await _apiService.signalArrival(widget.bookingId);
    setState(() {
      _isLoading = false;
      _step = 'ARRIVED';
    });
  }

  void _verifyOtpAndStart() async {
    final otp = _otpController.text.trim();
    if (otp.length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter customer 4-digit OTP')),
      );
      return;
    }
    setState(() => _isLoading = true);
    final res = await _apiService.startTripWithOtp(widget.bookingId, otp);
    setState(() => _isLoading = false);

    if (res['status'] == 'TRIP_STARTED' || res['success'] == true) {
      setState(() => _step = 'TRIP_STARTED');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('✅ OTP Verified. Trip Meter Started.')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(res['error'] ?? 'Invalid customer OTP')),
      );
    }
  }

  void _completeTrip() async {
    setState(() => _isLoading = true);
    final res = await _apiService.completeTrip(widget.bookingId);
    setState(() {
      _isLoading = false;
      _completionResult = res;
      _step = 'COMPLETED';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        title: Text('Active Job • Booking #${widget.bookingId}', style: const TextStyle(fontSize: 14)),
        actions: [
          IconButton(
            icon: const Icon(Icons.call, color: Color(0xFF19B887)),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Calling customer Vikram Reddy (+919876543210)...')),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Simulated Map
          Expanded(
            flex: 4,
            child: Container(
              color: Colors.blueGrey.shade100,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.navigation, size: 48, color: Color(0xFF246BFD)),
                    const SizedBox(height: 8),
                    Text(
                      _step == 'NAVIGATING_TO_PICKUP'
                          ? 'Navigating to Customer Car\nHITEC City Cyber Towers'
                          : _step == 'ARRIVED'
                              ? 'At Customer Vehicle\nAwaiting Trip Start OTP'
                              : _step == 'TRIP_STARTED'
                                  ? 'Trip in Progress\nCustomer Car: Hyundai Verna (Manual)'
                                  : 'Trip Successfully Completed',
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF101D35)),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Operational Controls
          Expanded(
            flex: 5,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Customer & Car Details
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F7FB),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(
                      children: const [
                        CircleAvatar(backgroundColor: Color(0xFF101D35), child: Icon(Icons.person, color: Colors.white)),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Customer: Vikram Reddy', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              Text('Car: Sedan • TS09FA1234 • Manual Transmission', style: TextStyle(fontSize: 11, color: Colors.grey)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // State Driven Controls
                  if (_step == 'NAVIGATING_TO_PICKUP') ...[
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _signalArrival,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF246BFD),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: _isLoading
                            ? const CircularProgressIndicator(color: Colors.white)
                            : const Text('I HAVE ARRIVED AT CAR', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ] else if (_step == 'ARRIVED') ...[
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Enter Customer 4-digit Trip OTP to Start', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _otpController,
                          keyboardType: TextInputType.number,
                          maxLength: 4,
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 22, letterSpacing: 8, fontWeight: FontWeight.bold),
                          decoration: InputDecoration(
                            hintText: '7821',
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                        ),
                        const SizedBox(height: 8),
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _verifyOtpAndStart,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF19B887),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                            child: _isLoading
                                ? const CircularProgressIndicator(color: Colors.white)
                                : const Text('START TRIP METER', style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ],
                    ),
                  ] else if (_step == 'TRIP_STARTED') ...[
                    Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(12)),
                          child: const Text('Trip Meter Active • 42 mins elapsed • 0 mins waiting', style: TextStyle(fontSize: 12, color: Colors.green, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(height: 14),
                        SizedBox(
                          width: double.infinity,
                          height: 52,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _completeTrip,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF101D35),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                            child: _isLoading
                                ? const CircularProgressIndicator(color: Colors.white)
                                : const Text('COMPLETE TRIP & COLLECT FARE', style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ],
                    ),
                  ] else ...[
                    Column(
                      children: [
                        const Icon(Icons.check_circle, color: Color(0xFF19B887), size: 48),
                        const SizedBox(height: 8),
                        const Text('Trip Successfully Completed!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Text(
                          'Your Net Earnings (80%): ₹${_completionResult?['driverEarnings'] ?? 329.6}',
                          style: const TextStyle(fontSize: 14, color: Color(0xFF19B887), fontWeight: FontWeight.bold),
                        ),
                        Text(
                          'Platform Cut (20%): ₹${_completionResult?['platformCommission'] ?? 82.4}',
                          style: const TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: ElevatedButton(
                            onPressed: () => Navigator.pop(context),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF246BFD),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                            child: const Text('Back to Home Radar', style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
