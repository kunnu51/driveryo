import 'package:flutter/material.dart';
import 'screens/auth_screen.dart';
import 'screens/home_screen.dart';
import 'screens/booking_screen.dart';
import 'screens/live_tracking_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const DriveryoCustomerApp());
}

class DriveryoCustomerApp extends StatelessWidget {
  const DriveryoCustomerApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DRIVERYO',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF5F7FB),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF246BFD),
          primary: const Color(0xFF246BFD),
          secondary: const Color(0xFF101D35),
          surface: Colors.white,
        ),
        fontFamily: 'Inter',
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF101D35),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(),
        '/auth': (context) => const AuthScreen(),
        '/book': (context) => const BookingScreen(),
        '/tracking': (context) => const LiveTrackingScreen(
              bookingId: 'DRV-202611-1029',
              otpCode: '7821',
              driverName: 'Ramesh Reddy',
              driverPhone: '+919848011223',
            ),
      },
    );
  }
}
