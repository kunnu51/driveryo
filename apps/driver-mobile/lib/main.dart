import 'package:flutter/material.dart';
import 'screens/driver_home_screen.dart';
import 'screens/driver_registration_screen.dart';
import 'screens/driver_trip_screen.dart';
import 'screens/driver_earnings_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const DriveryoDriverApp());
}

class DriveryoDriverApp extends StatelessWidget {
  const DriveryoDriverApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DRIVERYO Driver Partner',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF5F7FB),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF19B887),
          primary: const Color(0xFF19B887),
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
        '/': (context) => const DriverHomeScreen(),
        '/register': (context) => const DriverRegistrationScreen(),
        '/trip': (context) => const DriverTripScreen(),
        '/earnings': (context) => const DriverEarningsScreen(),
      },
    );
  }
}
