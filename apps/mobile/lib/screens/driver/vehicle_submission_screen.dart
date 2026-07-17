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

  File? _frontPhotoFile;
  File? _rearPhotoFile;
  File? _sidePhotoFile;

  String? _frontPhotoUrl;
  String? _rearPhotoUrl;
  String? _sidePhotoUrl;

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
      _frontPhotoUrl = v['frontPhotoUrl'];
      _rearPhotoUrl = v['rearPhotoUrl'];
      _sidePhotoUrl = v['sidePhotoUrl'];
    }
  }

  Future<void> _pickImage(String side) async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 50,
      maxWidth: 800,
    );
    if (image != null) {
      setState(() {
        final file = File(image.path);
        if (side == 'front') {
          _frontPhotoFile = file;
          _frontPhotoUrl = null;
        }
        if (side == 'rear') {
          _rearPhotoFile = file;
          _rearPhotoUrl = null;
        }
        if (side == 'side') {
          _sidePhotoFile = file;
          _sidePhotoUrl = null;
        }
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    
    final hasFront = _frontPhotoFile != null || _frontPhotoUrl != null;
    final hasRear = _rearPhotoFile != null || _rearPhotoUrl != null;
    final hasSide = _sidePhotoFile != null || _sidePhotoUrl != null;

    if (!hasFront || !hasRear || !hasSide) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Les 3 photos sont obligatoires')));
      return;
    }

    setState(() => _isLoading = true);

    try {
      final fields = {
        'plateNumber': _plateController.text.trim(),
        'brand': _brandController.text.trim(),
        'model': _modelController.text.trim(),
        'year': _yearController.text.trim(),
        'type': _type,
      };

      final Map<String, File> files = {};
      if (_frontPhotoFile != null) files['frontPhoto'] = _frontPhotoFile!;
      if (_rearPhotoFile != null) files['rearPhoto'] = _rearPhotoFile!;
      if (_sidePhotoFile != null) files['sidePhoto'] = _sidePhotoFile!;

      if (widget.existingVehicle != null) {
        final id = widget.existingVehicle!['id'];
        await ApiClient().multipartRequest(
          'PATCH', 
          '/v1/drivers/me/vehicles/$id', 
          fields: fields,
          files: files,
        );
      } else {
        await ApiClient().multipartRequest(
          'POST', 
          '/v1/drivers/me/vehicles', 
          fields: fields,
          files: files,
        );
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Succès: véhicule soumis. (Debug: pas de pop)'), duration: Duration(seconds: 5)));
        // Navigator.pop(context, true); // TEMPORARILY COMMENTED OUT FOR DEBUG
      }
    } catch (e) {
      if (mounted) {
        // Show a massive snackbar
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('ERREUR API:\n${e.toString()}'),
          duration: const Duration(seconds: 15),
          backgroundColor: Colors.red,
        ));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Widget _buildPhotoPicker(String label, String side, File? file, String? url) {
    return GestureDetector(
      onTap: () => _pickImage(side),
      child: Container(
        height: 120,
        decoration: BoxDecoration(
          color: Theme.of(context).brightness == Brightness.dark ? Colors.grey[800] : Colors.grey[200],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[400]!),
        ),
        child: file != null
            ? ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.file(file, fit: BoxFit.cover, width: double.infinity),
              )
            : url != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(url, fit: BoxFit.cover, width: double.infinity),
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
      body: Stack(
        children: [
          SingleChildScrollView(
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
                      Expanded(child: _buildPhotoPicker('Avant', 'front', _frontPhotoFile, _frontPhotoUrl)),
                      const SizedBox(width: 8),
                      Expanded(child: _buildPhotoPicker('Arrière', 'rear', _rearPhotoFile, _rearPhotoUrl)),
                      const SizedBox(width: 8),
                      Expanded(child: _buildPhotoPicker('Latérale', 'side', _sidePhotoFile, _sidePhotoUrl)),
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
                      onPressed: _isLoading ? null : _submit,
                      child: const Text('Soumettre le véhicule', style: TextStyle(fontSize: 16)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Center(
                    child: Text(
                      'DEBUG: VehicleSubmissionScreen | Build: 5a875b0',
                      style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (_isLoading)
            Container(
              color: Colors.black.withOpacity(0.3),
              child: const Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }
}
