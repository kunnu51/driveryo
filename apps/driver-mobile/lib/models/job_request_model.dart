class JobRequestModel {
  final String bookingId;
  final String bookingNumber;
  final String pickupLocation;
  final String destinationLocation;
  final String serviceCategory;
  final double durationHours;
  final String vehicleTransmission;
  final String vehicleCategory;
  final String customerPhone;
  final double grossFare;
  final double netEarnings; // 80% split
  final String otpStartCode;

  JobRequestModel({
    required this.bookingId,
    required this.bookingNumber,
    required this.pickupLocation,
    required this.destinationLocation,
    required this.serviceCategory,
    required this.durationHours,
    required this.vehicleTransmission,
    required this.vehicleCategory,
    required this.customerPhone,
    required this.grossFare,
    required this.netEarnings,
    required this.otpStartCode,
  });

  factory JobRequestModel.fromJson(Map<String, dynamic> json) {
    double gross = (json['estimatedFare'] as num?)?.toDouble() ??
        (json['fareBreakdown']?['total'] as num?)?.toDouble() ??
        412.0;
    return JobRequestModel(
      bookingId: json['id'] ?? '',
      bookingNumber: json['bookingNumber'] ?? json['id'] ?? '',
      pickupLocation: json['pickupLocation'] ?? 'HITEC City Cyber Towers',
      destinationLocation: json['destinationLocation'] ?? 'RGIA Airport',
      serviceCategory: json['serviceCategory'] ?? 'INSTANT',
      durationHours: (json['durationHours'] as num?)?.toDouble() ?? 2.0,
      vehicleTransmission: json['vehicleTransmission'] ?? 'MANUAL',
      vehicleCategory: json['vehicleCategory'] ?? 'SEDAN',
      customerPhone: json['customerPhone'] ?? '+919876543210',
      grossFare: gross,
      netEarnings: (gross * 0.8).roundToDouble(),
      otpStartCode: json['otpStartCode'] ?? '7821',
    );
  }
}
