import 'package:flutter/material.dart';
import '../services/driver_api_service.dart';
import '../models/earnings_model.dart';

class DriverEarningsScreen extends StatefulWidget {
  const DriverEarningsScreen({Key? key}) : super(key: key);

  @override
  State<DriverEarningsScreen> createState() => _DriverEarningsScreenState();
}

class _DriverEarningsScreenState extends State<DriverEarningsScreen> {
  final DriverApiService _apiService = DriverApiService();
  EarningsModel? _earnings;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchEarnings();
  }

  void _fetchEarnings() async {
    final earnings = await _apiService.getEarnings();
    if (mounted) {
      setState(() {
        _earnings = earnings;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(title: const Text('Earnings & Bank Payouts')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Payout Balance Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF101D35), Color(0xFF1E3A8A)],
                      ),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Available for Bank Payout', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(height: 6),
                        Text(
                          '₹${_earnings?.pendingPayout.toStringAsFixed(2) ?? '3,200.00'}',
                          style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Auto-Transfer Every Tuesday', style: TextStyle(color: Colors.white60, fontSize: 11)),
                            ElevatedButton(
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Instant Payout of ₹${_earnings?.pendingPayout.toStringAsFixed(0)} initiated to HDFC Bank ****1234')),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF19B887),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              child: const Text('Withdraw Now', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Performance Breakdown
                  const Text('Performance Summary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF101D35))),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      _buildStatCard('Gross Total', '₹${_earnings?.totalGrossEarnings.toStringAsFixed(0)}', '${_earnings?.tripsCount} Lifetime Trips'),
                      const SizedBox(width: 12),
                      _buildStatCard('Net Earned (80%)', '₹${_earnings?.netPayable.toStringAsFixed(0)}', 'Platform Cut: ₹${_earnings?.platformCommissionTotal.toStringAsFixed(0)}'),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Commission Transparency
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Transparent 80/20 Commission Split', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF101D35))),
                        SizedBox(height: 4),
                        Text(
                          'You retain 80% of customer gross fare on all Instant, Scheduled, Daily and Outstation trips. Platform fee is 20%.',
                          style: TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Linked Bank Account
                  const Text('Payout Destination Account', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF101D35))),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.account_balance, color: Color(0xFF246BFD), size: 28),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text('HDFC Bank • A/C **** 1234', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              Text('Beneficiary: Ramesh Reddy • IFSC: HDFC0001234', style: TextStyle(fontSize: 11, color: Colors.grey)),
                            ],
                          ),
                        ),
                        const Icon(Icons.verified, color: Color(0xFF19B887), size: 20),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildStatCard(String label, String amount, String subtitle) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(color: Colors.grey, fontSize: 11)),
            const SizedBox(height: 6),
            Text(amount, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF101D35))),
            const SizedBox(height: 2),
            Text(subtitle, style: const TextStyle(fontSize: 10, color: Color(0xFF19B887), fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}
