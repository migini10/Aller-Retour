class TripModel {
  final String id;
  final String routeId;
  final String vehicleId;
  final String driverId;
  final DateTime departureTime;
  final String status;
  final double pricePerSeat;
  final bool isLocked;
  final int seatsOffered;
  final int initialPassengers;
  
  // Relations mapped from NestJS
  final String originCity;
  final String destinationCity;
  final String vehiclePlateNumber;
  final String driverName;
  final String driverPhone;
  final int availableSeats;
  final int passagers; // Total passagers (initial + booked)
  final bool isCertified;

  TripModel({
    required this.id,
    required this.routeId,
    required this.vehicleId,
    required this.driverId,
    required this.departureTime,
    required this.status,
    required this.pricePerSeat,
    required this.isLocked,
    required this.seatsOffered,
    required this.initialPassengers,
    required this.originCity,
    required this.destinationCity,
    required this.vehiclePlateNumber,
    required this.driverName,
    required this.driverPhone,
    required this.availableSeats,
    required this.passagers,
    this.isCertified = false,
  });

  factory TripModel.fromJson(Map<String, dynamic> json) {
    return TripModel(
      id: json['id'] ?? '',
      routeId: json['routeId'] ?? '',
      vehicleId: json['vehicleId'] ?? '',
      driverId: json['driverId'] ?? '',
      departureTime: DateTime.parse(json['departureTime'] ?? DateTime.now().toIso8601String()),
      status: json['status'] ?? 'SCHEDULED',
      pricePerSeat: (json['pricePerSeat'] ?? 0).toDouble(),
      isLocked: json['isLocked'] ?? false,
      seatsOffered: json['seatsOffered'] ?? 4,
      initialPassengers: json['initialPassengers'] ?? 0,
      
      originCity: json['route']?['originStation']?['city'] ?? 'Inconnu',
      destinationCity: json['route']?['destinationStation']?['city'] ?? 'Inconnu',
      vehiclePlateNumber: json['vehicle']?['plateNumber'] ?? 'Véhicule',
      driverName: json['driverName'] ?? json['driver']?['user']?['fullName'] ?? 'Chauffeur Inconnu',
      driverPhone: json['driverPhone'] ?? json['driver']?['user']?['phone'] ?? '',
      availableSeats: json['availableSeats'] ?? 0,
      passagers: json['passagers'] ?? 0,
      isCertified: json['isCertified'] ?? false,
    );
  }

  // To avoid breaking the UI massively, we expose the legacy format map
  Map<String, dynamic> toLegacyMap() {
    String dateStr = "Aujourd'hui";
    String heureStr = "12:00";
    
    DateTime d = departureTime.toLocal();
    DateTime now = DateTime.now();
    DateTime today = DateTime(now.year, now.month, now.day);
    DateTime tomorrow = today.add(const Duration(days: 1));
    DateTime tripDay = DateTime(d.year, d.month, d.day);
    
    if (tripDay == today) {
      dateStr = "Aujourd'hui";
    } else if (tripDay == tomorrow) {
      dateStr = "Demain";
    } else {
      List<String> jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
      List<String> mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      String dayName = jours[d.weekday - 1];
      String dayStr = d.day == 1 ? '1er' : d.day.toString();
      String monthName = mois[d.month - 1];
      dateStr = '$dayName $dayStr $monthName';
    }
    heureStr = '${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';

    String mappedStatut = 'programmé';
    switch (status) {
      case 'SCHEDULED':
        mappedStatut = 'programmé';
        break;
      case 'IN_PROGRESS':
        mappedStatut = 'en cours';
        break;
      case 'COMPLETED':
        mappedStatut = 'terminé';
        break;
      case 'CANCELLED':
        mappedStatut = 'annulé';
        break;
    }
    
    // Auto-expire past trips that haven't started
    final isPast2Hours = DateTime.now().difference(d).inMinutes >= 120;
    if (isPast2Hours && mappedStatut == 'programmé') {
      mappedStatut = 'expiré';
    }

    String displayId = 'TRIP-${id.split('-').first.toUpperCase()}';

    return {
      'id': id,
      'displayId': displayId,
      'trajet': '$originCity - $destinationCity',
      'date': dateStr,
      'rawDate': departureTime.toIso8601String().split('T')[0],
      'departureTime': departureTime.toIso8601String(),
      'heure': heureStr,
      'vehicule': vehiclePlateNumber,
      'statut': mappedStatut,
      'passagers': passagers,
      'placesPrises': passagers,
      'placesLibres': availableSeats,
      'pricePerSeat': pricePerSeat,
      'isAirConditioned': true,
      'takesTollRoad': true,
      'driverName': driverName,
      'driverPhone': driverPhone,
      'isCertified': isCertified,
      'isLocked': isLocked,
    };
  }
}
