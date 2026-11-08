class UserModel {
  final String id;
  final String phone;
  final String? fullName;
  final String? email;
  final String role;
  final String? token;

  UserModel({
    required this.id,
    required this.phone,
    this.fullName,
    this.email,
    required this.role,
    this.token,
  });

  factory UserModel.fromJson(Map<String, dynamic> json, {String? token}) {
    return UserModel(
      id: json['id'] ?? '',
      phone: json['phone'] ?? '',
      fullName: json['fullName'],
      email: json['email'],
      role: json['role'] ?? 'CUSTOMER',
      token: token ?? json['accessToken'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'phone': phone,
      'fullName': fullName,
      'email': email,
      'role': role,
      'token': token,
    };
  }
}
