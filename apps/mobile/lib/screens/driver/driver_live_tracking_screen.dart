import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class DriverLiveTrackingScreen extends StatefulWidget {
  final Map<String, dynamic> mission;
  
  const DriverLiveTrackingScreen({super.key, required this.mission});

  @override
  State<DriverLiveTrackingScreen> createState() => _DriverLiveTrackingScreenState();
}

class _DriverLiveTrackingScreenState extends State<DriverLiveTrackingScreen> {
  final Completer<GoogleMapController> _controller = Completer();
  
  Set<Marker> _markers = {};
  Set<Polyline> _polylines = {};
  List<LatLng> polylineCoordinates = [];
  late PolylinePoints polylinePoints;
  
  Position? _currentPosition;
  StreamSubscription<Position>? _positionStreamSubscription;
  
  String _destinationCity = 'Destination';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _extractDestination();
    _checkLocationPermissionAndStartTracking();
  }

  void _extractDestination() {
    String trajet = widget.mission['trajet'] ?? '';
    String separator = trajet.contains('→') ? '→' : trajet.contains('->') ? '->' : trajet.contains(' - ') ? ' - ' : '-';
    List<String> parts = trajet.split(separator);
    if (parts.length > 1) {
      _destinationCity = parts[1].trim();
    } else {
      _destinationCity = trajet.trim();
    }
  }

  Future<void> _checkLocationPermissionAndStartTracking() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location permissions are denied');
      }
    }
    
    if (permission == LocationPermission.deniedForever) {
      return Future.error('Location permissions are permanently denied.');
    }

    // Get current location
    _currentPosition = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
    
    // Initialize polylinePoints with API key
    String googleApiKey = dotenv.env['GOOGLE_MAPS_API_KEY'] ?? '';
    polylinePoints = PolylinePoints(apiKey: googleApiKey);
    
    // Attempt to draw route if API key exists
    await _getRouteToDestination(googleApiKey);

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }

    // Start live tracking
    _startLocationUpdates();
  }

  Future<void> _getRouteToDestination(String googleApiKey) async {
    if (_currentPosition == null || googleApiKey.isEmpty) return;

    try {
      // Pour une vraie app, on devrait géocoder la destination. On simule ici la destination avec un point générique.
      // Dans le futur on intégrera Google Places Geocoding pour avoir la position exacte de `_destinationCity`.
      
      PolylineResult result = await polylinePoints.getRouteBetweenCoordinates(
        request: PolylineRequest(
          origin: PointLatLng(_currentPosition!.latitude, _currentPosition!.longitude),
          destination: PointLatLng(_currentPosition!.latitude + 0.05, _currentPosition!.longitude + 0.05), // Mock destination
          mode: TravelMode.driving,
        ),
      );

      if (result.points.isNotEmpty) {
        for (var point in result.points) {
          polylineCoordinates.add(LatLng(point.latitude, point.longitude));
        }

        if (mounted) {
          setState(() {
            _polylines.add(Polyline(
              polylineId: const PolylineId("route"),
              color: Colors.orangeAccent,
              points: polylineCoordinates,
              width: 5,
            ));
          });
        }
      }
    } catch (e) {
      debugPrint("Error fetching polyline: \$e");
    }
  }

  void _startLocationUpdates() {
    final locationSettings = const LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 10,
    );

    _positionStreamSubscription = Geolocator.getPositionStream(locationSettings: locationSettings).listen((Position position) {
      if (mounted) {
        setState(() {
          _currentPosition = position;
          _updateMarker();
        });
      }
      _moveCamera(position);
    });
  }

  void _updateMarker() {
    if (_currentPosition != null) {
      _markers.add(
        Marker(
          markerId: const MarkerId('currentLocation'),
          position: LatLng(_currentPosition!.latitude, _currentPosition!.longitude),
          infoWindow: const InfoWindow(title: 'Ma Position'),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
        ),
      );
    }
  }

  Future<void> _moveCamera(Position position) async {
    if (!_controller.isCompleted) return;
    final GoogleMapController controller = await _controller.future;
    controller.animateCamera(CameraUpdate.newCameraPosition(
      CameraPosition(
        target: LatLng(position.latitude, position.longitude),
        zoom: 16.0,
        bearing: position.heading,
      ),
    ));
  }

  @override
  void dispose() {
    _positionStreamSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('En route vers \$_destinationCity', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.orangeAccent))
          : Stack(
              children: [
                GoogleMap(
                  initialCameraPosition: CameraPosition(
                    target: LatLng(_currentPosition!.latitude, _currentPosition!.longitude),
                    zoom: 15.0,
                  ),
                  myLocationEnabled: true,
                  myLocationButtonEnabled: false,
                  compassEnabled: true,
                  trafficEnabled: true,
                  markers: _markers,
                  polylines: _polylines,
                  onMapCreated: (GoogleMapController controller) {
                    _controller.complete(controller);
                    _updateMarker();
                  },
                ),
                Positioned(
                  bottom: 30,
                  left: 20,
                  right: 20,
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: 0.3), blurRadius: 10, offset: const Offset(0, 5)),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('Trajet Longue Distance', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        Text(widget.mission['trajet'] ?? '', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.pop(context); // Arriver / Terminer
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.redAccent,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            child: const Text('Terminer la navigation', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
