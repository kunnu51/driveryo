import 'package:flutter/material.dart';
import '../services/driver_api_service.dart';

class DriverRegistrationScreen extends StatefulWidget {
  const DriverRegistrationScreen({Key? key}) : super(key: key);

  @override
  State<DriverRegistrationScreen> createState() => _DriverRegistrationScreenState();
}

class _DriverRegistrationScreenState extends State<DriverRegistrationScreen> {
  final DriverApiService _apiService = DriverApiService();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _dlController = TextEditingController();
  String _transmission = 'BOTH';
  String _zone = 'HITEC City / Madhapur';
  bool _submitted = false;
  bool _isLoading = false;

  void _submitApplication() async {
    if (_nameController.text.trim().isEmpty || _dlController.text.trim().isEmpty || _phoneController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please complete all mandatory fields')),
      );
      return;
    }
    setState(() => _isLoading = true);
    final res = await _apiService.registerDriver(
      fullName: _nameController.text.trim(),
      phone: '+91${_phoneController.text.trim()}',
      licenseNumber: _dlController.text.trim(),
      transmissionCapability: _transmission,
      zone: _zone,
    );
    setState(() {
      _isLoading = false;
      _submitted = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(title: const Text('Driver KYC & Verification')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: _submitted
            ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.check_circle, color: Color(0xFF19B887), size: 64),
                      const SizedBox(height: 16),
                      const Text('Application Submitted for Approval', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                      const SizedBox(height: 8),
                      const Text(
                        'Our Hyderabad partner onboarding team is verifying your Driving License & Aadhaar details. You will receive an SMS upon approval.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () => Navigator.pop(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF246BFD),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('Return to Home'),
                      ),
                    ],
                  ),
                ),
              )
            : Card(
                elevation: 1,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Personal Information', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF101D35))),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _nameController,
                        decoration: InputDecoration(
                          labelText: 'Full Legal Name (as per Aadhaar)',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        maxLength: 10,
                        decoration: InputDecoration(
                          labelText: 'Mobile Number',
                          prefixText: '+91 ',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _dlController,
                        decoration: InputDecoration(
                          labelText: 'Driving License Number',
                          hintText: 'TS0920200001234',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text('Transmission Capability', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        value: _transmission,
                        decoration: InputDecoration(border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
                        items: const [
                          DropdownMenuItem(value: 'BOTH', child: Text('Both Manual & Automatic (Highest Orders)')),
                          DropdownMenuItem(value: 'MANUAL', child: Text('Manual Gears Only')),
                          DropdownMenuItem(value: 'AUTOMATIC', child: Text('Automatic Gears Only')),
                        ],
                        onChanged: (val) => setState(() => _transmission = val!),
                      ),
                      const SizedBox(height: 16),
                      const Text('Preferred Operating Zone', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        value: _zone,
                        decoration: InputDecoration(border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
                        items: const [
                          DropdownMenuItem(value: 'HITEC City / Madhapur', child: Text('HITEC City / Madhapur')),
                          DropdownMenuItem(value: 'Gachibowli / Financial District', child: Text('Gachibowli / Financial District')),
                          DropdownMenuItem(value: 'Jubilee Hills / Banjara Hills', child: Text('Jubilee Hills / Banjara Hills')),
                          DropdownMenuItem(value: 'Secunderabad / Begumpet', child: Text('Secunderabad / Begumpet')),
                          DropdownMenuItem(value: 'RGIA Airport Zone', child: Text('RGIA Airport Zone')),
                        ],
                        onChanged: (val) => setState(() => _zone = val!),
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _submitApplication,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF19B887),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          child: _isLoading
                              ? const CircularProgressIndicator(color: Colors.white)
                              : const Text('SUBMIT APPLICATION', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
      ),
    );
  }
}
