import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        title: const Text('DRIVERYO • Hyderabad', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () => Navigator.pushNamed(context, '/auth'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Current Location Pill
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: const [
                  Icon(Icons.my_location, color: Color(0xFF246BFD), size: 20),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'HITEC City / Cyber Towers, Hyderabad',
                      style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Color(0xFF101D35)),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Text('Change', style: TextStyle(color: Color(0xFF246BFD), fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Active Trip Banner (if ongoing)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF101D35), Color(0xFF1C2D52)],
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF246BFD),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.navigation, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Assigned Chauffeur Arriving', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                        SizedBox(height: 2),
                        Text('Ramesh Reddy (4.9★) • 6 mins away', style: TextStyle(color: Colors.grey, fontSize: 11)),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/tracking'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF19B887),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Track', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Service Quick Selector
            const Text(
              'Select Driver Service',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF101D35)),
            ),
            const SizedBox(height: 12),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.3,
              children: [
                _buildServiceCard(context, 'Instant Driver', '⚡', '10-15m ETA', '₹349 (2h)', () => Navigator.pushNamed(context, '/book')),
                _buildServiceCard(context, 'Scheduled', '📅', 'Advance reserve', '₹399 (2h)', () => Navigator.pushNamed(context, '/book')),
                _buildServiceCard(context, 'Daily Chauffeur', '🚗', '8 hours full day', '₹1,199 (8h)', () => Navigator.pushNamed(context, '/book')),
                _buildServiceCard(context, 'Outstation', '🛣️', 'Intercity getaways', '₹1,899 (12h)', () => Navigator.pushNamed(context, '/book')),
              ],
            ),
            const SizedBox(height: 20),

            // Why Driveryo Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFEAF1FF),
                borderRadius: BorderRadius.circular(18),
              ),
              child: Row(
                children: const [
                  Icon(Icons.verified_user, color: Color(0xFF246BFD), size: 28),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Your Personal Car Chauffeur', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF101D35), fontSize: 13)),
                        Text('100% Police checked • Manual & Automatic drivers • Trip Start OTP', style: TextStyle(fontSize: 11, color: Colors.blueGrey)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        selectedItemColor: const Color(0xFF246BFD),
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.directions_car), label: 'Book'),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Trips'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), label: 'Wallet'),
        ],
        onTap: (index) {
          if (index == 1) Navigator.pushNamed(context, '/book');
          if (index == 2) Navigator.pushNamed(context, '/tracking');
        },
      ),
    );
  }

  Widget _buildServiceCard(BuildContext context, String title, String icon, String subtitle, String price, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(icon, style: const TextStyle(fontSize: 24)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEAF1FF),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(price, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF246BFD))),
                ),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF101D35))),
                Text(subtitle, style: const TextStyle(fontSize: 10, color: Colors.grey)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
