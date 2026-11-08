import 'package:flutter/material.dart';
import '../services/driver_api_service.dart';
import '../models/earnings_model.dart';
import 'driver_trip_screen.dart';

class DriverHomeScreen extends StatefulWidget {
  const DriverHomeScreen({Key? key}) : super(key: key);

  @override
  State<DriverHomeScreen> createState() => _DriverHomeScreenState();
}

class _DriverHomeScreenState extends State<DriverHomeScreen> {
  final DriverApiService _apiService = DriverApiService();
  bool _isOnline = true;
  bool _hasIncomingRequest = true;
  EarningsModel? _earnings;

  @override
  void initState() {
    super.initState();
    _loadEarnings();
  }

  void _loadEarnings() async {
    final earnings = await _apiService.getEarnings();
    if (mounted) {
      setState(() => _earnings = earnings);
    }
  }

  void _toggleOnline(bool val) async {
    setState(() {
      _isOnline = val;
      if (!val) _hasIncomingRequest = false;
    });
    await _apiService.toggleAvailability(val);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        title: const Text('DRIVERYO Partner • Hyderabad', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_balance_wallet_outlined),
            onPressed: () => Navigator.pushNamed(context, '/earnings'),
          ),
          IconButton(
            icon: const Icon(Icons.badge_outlined),
            onPressed: () => Navigator.pushNamed(context, '/register'),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Online / Offline Status Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              color: _isOnline ? const Color(0xFF101D35) : Colors.grey.shade800,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _isOnline ? const Color(0xFF19B887) : Colors.grey,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        _isOnline ? 'ONLINE • Receiving Trips' : 'OFFLINE',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ],
                  ),
                  Switch(
                    value: _isOnline,
                    activeColor: const Color(0xFF19B887),
                    onChanged: _toggleOnline,
                  ),
                ],
              ),
            ),

            // Top Earnings Summary Pill
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Column(
                      children: [
                        const Text('Available Payout', style: TextStyle(color: Colors.grey, fontSize: 11)),
                        const SizedBox(height: 4),
                        Text('₹${_earnings?.pendingPayout.toStringAsFixed(0) ?? '3,200'}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF101D35))),
                      ],
                    ),
                    Container(height: 30, width: 1, color: Colors.grey.shade200),
                    Column(
                      children: [
                        const Text('Completed Trips', style: TextStyle(color: Colors.grey, fontSize: 11)),
                        const SizedBox(height: 4),
                        Text('${_earnings?.tripsCount ?? 28} Trips', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF19B887))),
                      ],
                    ),
                    Container(height: 30, width: 1, color: Colors.grey.shade200),
                    Column(
                      children: const [
                        Text('Driver Rating', style: TextStyle(color: Colors.grey, fontSize: 11)),
                        SizedBox(height: 4),
                        Text('4.9 ★', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.amber)),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Center: Incoming Order Radar or Idle State
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: _hasIncomingRequest && _isOnline
                    ? _buildIncomingOfferCard(context)
                    : Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              _isOnline ? Icons.radar : Icons.power_settings_new,
                              size: 64,
                              color: _isOnline ? const Color(0xFF19B887) : Colors.grey,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              _isOnline ? 'Searching for trips in HITEC City...' : 'Go online to receive customer trip requests',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF101D35)),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _isOnline ? 'High booking demand detected in Gachibowli' : 'Make sure battery saver is disabled for GPS',
                              style: const TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                          ],
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIncomingOfferCard(BuildContext context) {
    return Card(
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEAF1FF),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Text('NEW DISPATCH REQUEST', style: TextStyle(color: Color(0xFF246BFD), fontSize: 10, fontWeight: FontWeight.bold)),
                ),
                const Text('30s to accept', style: TextStyle(color: Colors.redAccent, fontSize: 11, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),

            // Estimated Earnings
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('Customer Vehicle: Sedan (Manual)', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text('Instant Driver (2 Hours)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF101D35))),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: const [
                    Text('Your Payout (80%)', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    Text('₹329.60', style: TextStyle(fontSize: 22, fontWeight: FontWeight.black, color: Color(0xFF19B887))),
                  ],
                ),
              ],
            ),
            const Divider(),

            // Trip Locations
            Column(
              children: [
                Row(
                  children: const [
                    Icon(Icons.trip_origin, color: Color(0xFF19B887), size: 16),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text('Pickup: HITEC City Cyber Towers (0.8 km away)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: const [
                    Icon(Icons.location_on, color: Color(0xFF246BFD), size: 16),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text('Drop: RGIA Airport Shamshabad', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      setState(() => _hasIncomingRequest = false);
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      side: BorderSide(color: Colors.grey.shade300),
                    ),
                    child: const Text('Decline', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const DriverTripScreen(bookingId: 'DRV-8942'),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF19B887),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 2,
                    ),
                    child: const Text('ACCEPT TRIP', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
