class EarningsModel {
  final String driverId;
  final double totalGrossEarnings;
  final double platformCommissionTotal; // 20%
  final double netPayable;             // 80%
  final double pendingPayout;
  final int tripsCount;
  final String currency;

  EarningsModel({
    required this.driverId,
    required this.totalGrossEarnings,
    required this.platformCommissionTotal,
    required this.netPayable,
    required this.pendingPayout,
    required this.tripsCount,
    this.currency = 'INR',
  });

  factory EarningsModel.fromJson(Map<String, dynamic> json) {
    return EarningsModel(
      driverId: json['driverId'] ?? 'drv_demo_01',
      totalGrossEarnings: (json['totalGrossEarnings'] as num?)?.toDouble() ??
          (json['todayEarnings'] != null ? (json['todayEarnings'] as num).toDouble() * 1.25 : 18450.0),
      platformCommissionTotal: (json['platformCommissionTotal'] as num?)?.toDouble() ?? 3690.0,
      netPayable: (json['netPayable'] as num?)?.toDouble() ?? 14760.0,
      pendingPayout: (json['pendingPayout'] as num?)?.toDouble() ?? 3200.0,
      tripsCount: (json['tripsCount'] as num?)?.toInt() ?? (json['todayTrips'] as num?)?.toInt() ?? 28,
      currency: json['currency'] ?? 'INR',
    );
  }
}
