import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/booking_model.dart';
import 'live_tracking_screen.dart';

class BookingScreen extends StatefulWidget {
  const BookingScreen({Key? key}) : super(key: key);

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  final CustomerApiService _apiService = CustomerApiService();
  String _selectedService = 'INSTANT';
  String _transmission = 'MANUAL';
  String _vehicleCategory = 'SEDAN';
  double _duration = 2.0;
  final TextEditingController _pickupController = TextEditingController(text: 'HITEC City / Cyber Towers, Hyderabad');
  final TextEditingController _destController = TextEditingController(text: 'Rajiv Gandhi International Airport (RGIA), Shamshabad');
  final TextEditingController _promoController = TextEditingController();
  
  bool _isSubmitting = false;
  Map<String, dynamic> _fareEstimate = {
    'baseFare': 349,
    'gst': 63,
    'discount': 0,
    'total': 412,
  };

  @override
  void initState() {
    super.initState();
    _fetchFare();
  }

  void _fetchFare() async {
    final res = await _apiService.estimateFare(
      serviceCategory: _selectedService,
      durationHours: _duration,
      promoCode: _promoController.text.trim(),
      vehicleTransmission: _transmission,
      vehicleCategory: _vehicleCategory,
    );
    if (mounted) {
      setState(() => _fareEstimate = res);
    }
  }

  void _confirmBooking() async {
    setState(() => _isSubmitting = true);
    final booking = await _apiService.createBooking(
      customerPhone: _apiService.currentUser?.phone ?? '+919876543210',
      pickupLocation: _pickupController.text.trim(),
      destinationLocation: _destController.text.trim(),
      serviceCategory: _selectedService,
      durationHours: _duration,
      vehicleTransmission: _transmission,
      vehicleCategory: _vehicleCategory,
      promoCode: _promoController.text.trim(),
    );
    setState(() => _isSubmitting = false);

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => LiveTrackingScreen(
          bookingId: booking.bookingNumber,
          otpCode: booking.otpStartCode,
          driverName: booking.assignedDriver?['fullName'] ?? 'Ramesh Reddy',
          driverPhone: booking.assignedDriver?['phone'] ?? '+919848011223',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    num totalFare = _fareEstimate['total'] ?? 412;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(title: const Text('Book a Chauffeur')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Service Selector Row
            const Text('Service Type', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF101D35))),
            const SizedBox(height: 8),
            Row(
              children: [
                _buildServiceChip('INSTANT', '⚡ Instant'),
                const SizedBox(width: 8),
                _buildServiceChip('SCHEDULED', '📅 Scheduled'),
                const SizedBox(width: 8),
                _buildServiceChip('DAILY', '🚗 Daily (8h)'),
              ],
            ),
            const SizedBox(height: 16),

            // Locations Card
            Card(
              elevation: 1,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    TextField(
                      controller: _pickupController,
                      decoration: const InputDecoration(
                        icon: Icon(Icons.location_on, color: Color(0xFF19B887)),
                        labelText: 'Pickup Location (Hyderabad)',
                        border: InputBorder.none,
                      ),
                    ),
                    const Divider(),
                    TextField(
                      controller: _destController,
                      decoration: const InputDecoration(
                        icon: Icon(Icons.flag, color: Color(0xFF246BFD)),
                        labelText: 'Destination Location',
                        border: InputBorder.none,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Transmission Selection
            const Text('Car Transmission (Your Own Car)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF101D35))),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() => _transmission = 'MANUAL');
                      _fetchFare();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _transmission == 'MANUAL' ? const Color(0xFF246BFD) : Colors.white,
                      foregroundColor: _transmission == 'MANUAL' ? Colors.white : Colors.black87,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      side: BorderSide(color: _transmission == 'MANUAL' ? const Color(0xFF246BFD) : Colors.grey.shade300),
                    ),
                    child: const Text('⚙️ Manual Gear'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() => _transmission = 'AUTOMATIC');
                      _fetchFare();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _transmission == 'AUTOMATIC' ? const Color(0xFF246BFD) : Colors.white,
                      foregroundColor: _transmission == 'AUTOMATIC' ? Colors.white : Colors.black87,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      side: BorderSide(color: _transmission == 'AUTOMATIC' ? const Color(0xFF246BFD) : Colors.grey.shade300),
                    ),
                    child: const Text('🚗 Automatic (AMT/CVT)'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Car Category Dropdown
            const Text('Vehicle Category', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF101D35))),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _vehicleCategory,
                  isExpanded: true,
                  items: const [
                    DropdownMenuItem(value: 'HATCHBACK', child: Text('Hatchback (Swift, Tiago, i10)')),
                    DropdownMenuItem(value: 'SEDAN', child: Text('Sedan (City, Verna, Ciaz)')),
                    DropdownMenuItem(value: 'SUV', child: Text('SUV / MUV (Creta, Innova, Scorpio)')),
                    DropdownMenuItem(value: 'LUXURY', child: Text('Luxury (BMW, Audi, Mercedes)')),
                  ],
                  onChanged: (val) {
                    setState(() => _vehicleCategory = val!);
                    _fetchFare();
                  },
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Promo Code Input
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _promoController,
                    textCapitalization: TextCapitalization.characters,
                    decoration: InputDecoration(
                      hintText: 'Enter Coupon (FIRSTTRIP)',
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _fetchFare,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF101D35),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Apply'),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Fare Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFEAF1FF),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFF246BFD).withOpacity(0.2)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Estimated Fare Breakdown', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF101D35))),
                      Text(
                        'Base: ₹${_fareEstimate['baseFare']} • GST: ₹${_fareEstimate['gst']}${_fareEstimate['discount'] > 0 ? ' • Discount: -₹${_fareEstimate['discount']}' : ''}',
                        style: const TextStyle(fontSize: 11, color: Colors.blueGrey),
                      ),
                    ],
                  ),
                  Text('₹$totalFare', style: const TextStyle(fontWeight: FontWeight.black, fontSize: 22, color: Color(0xFF246BFD))),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Confirm Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _confirmBooking,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF246BFD),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 3,
                ),
                child: _isSubmitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Confirm & Request Chauffeur', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceChip(String id, String label) {
    bool isSelected = _selectedService == id;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedService = id;
            if (id == 'DAILY') _duration = 8.0;
            else if (id == 'OUTSTATION') _duration = 12.0;
            else _duration = 2.0;
          });
          _fetchFare();
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF246BFD) : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSelected ? const Color(0xFF246BFD) : Colors.grey.shade300),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.white : Colors.black87,
            ),
          ),
        ),
      ),
    );
  }
}
