import 'package:flutter/material.dart';
import '../services/api_service.dart';

class LiveTrackingScreen extends StatefulWidget {
  final String bookingId;
  final String otpCode;
  final String driverName;
  final String driverPhone;

  const LiveTrackingScreen({
    Key? key,
    this.bookingId = 'DRV-202611-1029',
    this.otpCode = '7821',
    this.driverName = 'Ramesh Reddy',
    this.driverPhone = '+919848011223',
  }) : super(key: key);

  @override
  State<LiveTrackingScreen> createState() => _LiveTrackingScreenState();
}

class _LiveTrackingScreenState extends State<LiveTrackingScreen> {
  final CustomerApiService _apiService = CustomerApiService();
  String _tripStatus = 'DRIVER_ARRIVING'; // DRIVER_ARRIVING, DRIVER_ARRIVED, TRIP_STARTED, TRIP_COMPLETED
  bool _isProcessingPayment = false;
  int _selectedRating = 5;
  final TextEditingController _reviewController = TextEditingController();

  void _showRatingModal() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Rate Your Chauffeur', textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(widget.driverName, style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF101D35))),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (index) {
                  return IconButton(
                    icon: Icon(
                      index < _selectedRating ? Icons.star : Icons.star_border,
                      color: Colors.amber,
                      size: 32,
                    ),
                    onPressed: () {
                      setModalState(() => _selectedRating = index + 1);
                    },
                  );
                }),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _reviewController,
                decoration: InputDecoration(
                  hintText: 'Share feedback on driving & courtesy...',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                maxLines: 2,
              ),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () async {
                await _apiService.rateTrip(widget.bookingId, _selectedRating, _reviewController.text);
                Navigator.pop(ctx);
                Navigator.pushReplacementNamed(context, '/');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF246BFD),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('Submit Rating'),
            ),
          ],
        ),
      ),
    );
  }

  void _handlePayment() async {
    setState(() => _isProcessingPayment = true);
    final order = await _apiService.createPaymentOrder(widget.bookingId, 412.0);
    // Simulate Razorpay checkout verification
    await Future.delayed(const Duration(milliseconds: 800));
    await _apiService.verifyPayment(
      order['orderId'] ?? 'order_sim_123',
      'pay_sim_${DateTime.now().millisecondsSinceEpoch}',
      'sig_mock_verified',
    );
    setState(() => _isProcessingPayment = false);
    _showRatingModal();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        title: Text('Booking #${widget.bookingId}', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.sos, color: Colors.redAccent),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('🚨 Emergency SOS activated. Driveryo Hyderabad Response Team alerted.')),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Simulated Map View Container
          Expanded(
            flex: 5,
            child: Container(
              color: Colors.blueGrey.shade100,
              child: Stack(
                children: [
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.map, size: 64, color: Colors.blueGrey),
                        SizedBox(height: 8),
                        Text(
                          'Live Hyderabad GPS Telemetry\n[HITEC City ➔ RGIA Airport]',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.blueGrey, fontSize: 13, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                  Positioned(
                    top: 16,
                    left: 16,
                    right: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 8)],
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.circle,
                            color: _tripStatus == 'TRIP_STARTED' ? const Color(0xFF246BFD) : const Color(0xFF19B887),
                            size: 12,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _tripStatus == 'DRIVER_ARRIVING'
                                  ? 'Driver is 4 mins away (Cyber Towers)'
                                  : _tripStatus == 'DRIVER_ARRIVED'
                                      ? 'Driver has arrived at your parked car'
                                      : _tripStatus == 'TRIP_STARTED'
                                          ? 'Trip in Progress (En route to destination)'
                                          : 'Trip Completed • Total ₹412',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Bottom Details & Actions Sheet
          Expanded(
            flex: 6,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10)],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // OTP Highlight Card
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.amber.shade50,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.amber.shade300),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text('Trip Start OTP', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.brown)),
                            Text('Share with driver only at vehicle', style: TextStyle(fontSize: 10, color: Colors.brown)),
                          ],
                        ),
                        Text(
                          widget.otpCode,
                          style: const TextStyle(fontWeight: FontWeight.black, fontSize: 24, letterSpacing: 4, color: Colors.brown),
                        ),
                      ],
                    ),
                  ),

                  // Driver Details Row
                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 26,
                        backgroundColor: Color(0xFF246BFD),
                        child: Icon(Icons.person, color: Colors.white, size: 30),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(widget.driverName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF101D35))),
                            Row(
                              children: const [
                                Icon(Icons.star, color: Colors.amber, size: 14),
                                SizedBox(width: 4),
                                Text('4.9 (340 trips) • Police Verified', style: TextStyle(fontSize: 11, color: Colors.grey)),
                              ],
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.phone, color: Color(0xFF19B887)),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Dialing ${widget.driverPhone}...')),
                          );
                        },
                      ),
                    ],
                  ),

                  // State Driven Controls
                  if (_tripStatus != 'TRIP_COMPLETED')
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => setState(() => _tripStatus = 'DRIVER_ARRIVED'),
                            child: const Text('Simulate Arrived', style: TextStyle(fontSize: 10)),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () => setState(() => _tripStatus = 'TRIP_STARTED'),
                            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF19B887), foregroundColor: Colors.white),
                            child: const Text('Simulate Start', style: TextStyle(fontSize: 10)),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () => setState(() => _tripStatus = 'TRIP_COMPLETED'),
                            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF101D35), foregroundColor: Colors.white),
                            child: const Text('Finish Trip', style: TextStyle(fontSize: 10)),
                          ),
                        ),
                      ],
                    )
                  else
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton.icon(
                        onPressed: _isProcessingPayment ? null : _handlePayment,
                        icon: const Icon(Icons.payment),
                        label: _isProcessingPayment
                            ? const CircularProgressIndicator(color: Colors.white)
                            : const Text('Pay ₹412 via Razorpay / UPI', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF19B887),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
