class ParcelModel {
  final String id;
  final String tripId;
  final String? senderId;
  final String? createdById;
  final String senderName;
  final String senderPhone;
  final String recipientName;
  final String recipientPhone;
  final double weightKg;
  final double price;
  final String trackingCode;
  final String? deliveryCode;
  final String status;
  
  final String? pickupAddress;
  final String? pickupCity;
  final double? pickupLatitude;
  final double? pickupLongitude;
  final String? pickupInstructions;

  final String? deliveryAddress;
  final String? deliveryCity;
  final double? deliveryLatitude;
  final double? deliveryLongitude;
  final String? deliveryInstructions;

  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? acceptedAt;
  final DateTime? inTransitAt;
  final DateTime? deliveredAt;

  ParcelModel({
    required this.id,
    required this.tripId,
    this.senderId,
    this.createdById,
    required this.senderName,
    required this.senderPhone,
    required this.recipientName,
    required this.recipientPhone,
    required this.weightKg,
    required this.price,
    required this.trackingCode,
    this.deliveryCode,
    required this.status,
    this.pickupAddress,
    this.pickupCity,
    this.pickupLatitude,
    this.pickupLongitude,
    this.pickupInstructions,
    this.deliveryAddress,
    this.deliveryCity,
    this.deliveryLatitude,
    this.deliveryLongitude,
    this.deliveryInstructions,
    required this.createdAt,
    required this.updatedAt,
    this.acceptedAt,
    this.inTransitAt,
    this.deliveredAt,
  });

  factory ParcelModel.fromJson(Map<String, dynamic> json) {
    return ParcelModel(
      id: json['id'] ?? '',
      tripId: json['tripId'] ?? '',
      senderId: json['senderId'],
      createdById: json['createdById'],
      senderName: json['senderName'] ?? '',
      senderPhone: json['senderPhone'] ?? '',
      recipientName: json['recipientName'] ?? '',
      recipientPhone: json['recipientPhone'] ?? '',
      weightKg: (json['weightKg'] ?? 0).toDouble(),
      price: (json['price'] ?? 0).toDouble(),
      trackingCode: json['trackingCode'] ?? '',
      deliveryCode: json['deliveryCode'], // Might be null for non-authorized users
      status: json['status'] ?? 'REGISTERED',
      pickupAddress: json['pickupAddress'],
      pickupCity: json['pickupCity'],
      pickupLatitude: json['pickupLatitude'] != null ? (json['pickupLatitude'] as num).toDouble() : null,
      pickupLongitude: json['pickupLongitude'] != null ? (json['pickupLongitude'] as num).toDouble() : null,
      pickupInstructions: json['pickupInstructions'],
      deliveryAddress: json['deliveryAddress'],
      deliveryCity: json['deliveryCity'],
      deliveryLatitude: json['deliveryLatitude'] != null ? (json['deliveryLatitude'] as num).toDouble() : null,
      deliveryLongitude: json['deliveryLongitude'] != null ? (json['deliveryLongitude'] as num).toDouble() : null,
      deliveryInstructions: json['deliveryInstructions'],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : DateTime.now(),
      acceptedAt: json['acceptedAt'] != null ? DateTime.parse(json['acceptedAt']) : null,
      inTransitAt: json['inTransitAt'] != null ? DateTime.parse(json['inTransitAt']) : null,
      deliveredAt: json['deliveredAt'] != null ? DateTime.parse(json['deliveredAt']) : null,
    );
  }

  bool get isRegistered => status == 'REGISTERED';
  bool get isAccepted => status == 'ACCEPTED';
  bool get isInTransit => status == 'IN_TRANSIT';
  bool get isDelivered => status == 'DELIVERED';
  bool get isLost => status == 'LOST';

  String get displayStatus {
    switch (status) {
      case 'REGISTERED': return 'En attente';
      case 'ACCEPTED': return 'Accepté';
      case 'IN_TRANSIT': return 'En transit';
      case 'DELIVERED': return 'Livré';
      case 'LOST': return 'Perdu';
      default: return 'Inconnu';
    }
  }
}
