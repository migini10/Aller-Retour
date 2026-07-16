import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:convert';
import 'dart:io';
import '../../services/api_client.dart';

class VehicleSubmissionScreen extends StatefulWidget {
  final Map<String, dynamic>? existingVehicle;

  const VehicleSubmissionScreen({super.key, this.existingVehicle});

  @override
  State<VehicleSubmissionScreen> createState() => _VehicleSubmissionScreenState();
}

class _VehicleSubmissionScreenState extends State<VehicleSubmissionScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  final _plateController = TextEditingController();
  final _brandController = TextEditingController();
  final _modelController = TextEditingController();
  final _yearController = TextEditingController();
  String _type = 'TAXI_5_PLACES';

  String? _frontPhotoBase64;
  String? _rearPhotoBase64;
  String? _sidePhotoBase64;

  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    if (widget.existingVehicle != null) {
      final v = widget.existingVehicle!;
      _plateController.text = v['plateNumber'] ?? '';
      _brandController.text = v['brand'] ?? '';
      _modelController.text = v['model'] ?? '';
      _yearController.text = v['year']?.toString() ?? '';
      _type = v['type'] ?? 'TAXI_5_PLACES';
      _frontPhotoBase64 = v['frontPhotoData'];
      _rearPhotoBase64 = v['rearPhotoData'];
      _sidePhotoBase64 = v['sidePhotoData'];
    }
  }

  Future<void> _pickImage(String side) async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 50,
      maxWidth: 800,
    );
    if (image != null) {
      final bytes = await File(image.path).readAsBytes();
      final base64String = "data:image/jpeg;base64," + base64Encode(bytes);
      setState(() {
        if (side == 'front') _frontPhotoBase64 = base64String;
        if (side == 'rear') _rearPhotoBase64 = base64String;
        if (side == 'side') _sidePhotoBase64 = base64String;
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    
    if (_frontPhotoBase64 == null || _rearPhotoBase64 == null || _sidePhotoBase64 == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Les 3 photos sont obligatoires')));
      return;
    }

    setState(() => _isLoading = true);

    try {
      final body = {
        'plateNumber': _plateController.text.trim(),
        'brand': _brandController.text.trim(),
        'model': _modelController.text.trim(),
        'year': int.tryParse(_yearController.text.trim()),
        'type': _type,
        'frontPhotoData': _frontPhotoBase64,
        'rearPhotoData': _rearPhotoBase64,
        'sidePhotoData': _sidePhotoBase64,
      };

      if (widget.existingVehicle != null) {
        final id = widget.existingVehicle!['id'];
        await ApiClient().patch('/v1/drivers/me/vehicles/$id', body: body);
      } else {
        await ApiClient().post('/v1/drivers/me/vehicles', body: body);
      }

      if (mounted) {
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: ${e.toString()}')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Widget _buildPhotoPicker(String label, String side, String? currentBase64) {
    return GestureDetector(
      onTap: () => _pickImage(side),
      child: Container(
        height: 120,
        decoration: BoxDecoration(
          color: Theme.of(context).brightness == Brightness.dark ? Colors.grey[800] : Colors.grey[200],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[400]!),
        ),
        child: currentBase64 != null
            ? ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.memory(
                  base64Decode(currentBase64.split(',').last),
                  fit: BoxFit.cover,
                  width: double.infinity,
                ),
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.camera_alt, size: 40, color: Colors.grey),
                  const SizedBox(height: 8),
                  Text(label, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                ],
              ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.existingVehicle != null ? 'Modifier Véhicule' : 'Ajouter un Véhicule'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Guide Image
                    const Text('Guide de prise de photo:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.asset('assets/images/vehicle_photo_guide_senegal_taxi.png', height: 180, width: double.infinity, fit: BoxFit.cover, errorBuilder: (c, e, s) => Container(height: 180, color: Colors.grey, child: const Center(child: Text('Image Guide Manquante', style: TextStyle(color: Colors.white))))),
                    ),
                    const SizedBox(height: 24),

                    // Photos
                    const Text('Photos du véhicule (Obligatoires)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(child: _buildPhotoPicker('Avant', 'front', _frontPhotoBase64)),
                        const SizedBox(width: 8),
                        Expanded(child: _buildPhotoPicker('Arrière', 'rear', _rearPhotoBase64)),
                        const SizedBox(width: 8),
                        Expanded(child: _buildPhotoPicker('Latérale', 'side', _sidePhotoBase64)),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Fields
                    TextFormField(
                      controller: _plateController,
                      decoration: const InputDecoration(labelText: 'Plaque d\'immatriculation', border: OutlineInputBorder()),
                      validator: (v) => v!.isEmpty ? 'Requis' : null,
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: _type,
                      decoration: const InputDecoration(labelText: 'Type de Véhicule', border: OutlineInputBorder()),
                      items: const [
                        DropdownMenuItem(value: 'TAXI_5_PLACES', child: Text('Taxi 5 Places')),
                        DropdownMenuItem(value: 'TAXI_7_PLACES', child: Text('Taxi 7 Places')),
                      ],
                      onChanged: (v) { if (v != null) setState(() => _type = v); },
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _brandController,
                            decoration: const InputDecoration(labelText: 'Marque (ex: Peugeot)', border: OutlineInputBorder()),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: TextFormField(
                            controller: _modelController,
                            decoration: const InputDecoration(labelText: 'Modèle', border: OutlineInputBorder()),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _yearController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Année (ex: 2015)', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 32),
                    
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: _submit,
                        child: const Text('Soumettre le véhicule', style: TextStyle(fontSize: 16)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
