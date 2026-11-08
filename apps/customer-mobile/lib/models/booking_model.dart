class BookingModel {
  final String id;
  final String bookingNumber;
  final String customerPhone;
  final String pickupLocation;
  final String destinationLocation;
  final String serviceCategory;
  final double durationHours;
  final String vehicleTransmission;
  final String vehicleCategory;
  final String otpStartCode;
  final String status;
  final double estimatedFare;
  final double? finalFare;
  final Map<String, dynamic>? assignedDriver;
  final String? createdAt;

  BookingModel({
    required this.id,
    required this.bookingNumber,
    required this.customerPhone,
    required this.pickupLocation,
    required this.destinationLocation,
    required this.serviceCategory,
    required this.durationHours,
    required this.vehicleTransmission,
    required this.vehicleCategory,
    required this.otpStartCode,
    required this.status,
    required this.estimatedFare,
    this.finalFare,
    this.assignedDriver,
    this.createdAt,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] ?? '',
      bookingNumber: json['bookingNumber'] ?? json['id'] ?? '',
      customerPhone: json['customerPhone'] ?? '',
      pickupLocation: json['pickupLocation'] ?? '',
      destinationLocation: json['destinationLocation'] ?? '',
      serviceCategory: json['serviceCategory'] ?? 'INSTANT',
      durationHours: (json['durationHours'] as num?)?.toDouble() ?? 2.0,
      vehicleTransmission: json['vehicleTransmission'] ?? 'MANUAL',
      vehicleCategory: json['vehicleCategory'] ?? 'SEDAN',
      otpStartCode: json['otpStartCode'] ?? '7821',
      status: json['status'] ?? 'REQUESTED',
      estimatedFare: (json['estimatedFare'] as num?)?.toDouble() ??
          (json['fareBreakdown']?['total'] as num?)?.toDouble() ??
          412.0,
      finalFare: (json['finalFare'] as num?)?.toDouble(),
      assignedDriver: json['assignedDriver'],
      createdAt: json['createdAt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'bookingNumber': bookingNumber,
      'customerPhone': customerPhone,
      'pickupLocation': pickupLocation,
      'destinationLocation': destinationLocation,
      'serviceCategory': serviceCategory,
      'durationHours': durationHours,
      'vehicleTransmission': vehicleTransmission,
      'vehicleCategory': vehicleCategory,
      'otpStartCode': otpStartCode,
      'status': status,
      'estimatedFare': estimatedFare,
      'finalFare': finalFare,
      'assignedDriver': assignedDriver,
      'createdAt': createdAt,
    };
  }
}
