import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../services/api_client.dart';

class VehicleDocumentsScreen extends StatefulWidget {
  final String vehicleId;
  const VehicleDocumentsScreen({super.key, required this.vehicleId});

  @override
  State<VehicleDocumentsScreen> createState() => _VehicleDocumentsScreenState();
}

class _VehicleDocumentsScreenState extends State<VehicleDocumentsScreen> {
  bool _isLoading = true;
  List<dynamic> _documents = [];
  String _error = '';
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _fetchDocuments();
  }

  Future<void> _fetchDocuments() async {
    setState(() { _isLoading = true; _error = ''; });
    try {
      final res = await ApiClient().get('/v1/drivers/me/vehicles/${widget.vehicleId}/documents');
      final data = jsonDecode(res.body);
      _documents = data['documents'] ?? [];
    } catch (e) {
      _error = 'Erreur de chargement: ${e.toString()}';
    } finally {
      if (mounted) setState(() { _isLoading = false; });
    }
  }

  Future<void> _uploadSimpleDocument(String type, ImageSource source) async {
    final XFile? image = await _picker.pickImage(source: source);
    if (image == null) return;
    
    if (!context.mounted) return;
    _performUpload(type, {'frontFile': File(image.path)});
  }

  void _showSimpleUploadBottomSheet(String type) async {
    final source = await _showImageSourcePicker();
    if (source != null) {
      _uploadSimpleDocument(type, source);
    }
  }

  Future<ImageSource?> _showImageSourcePicker() {
    return showModalBottomSheet<ImageSource>(
      context: context,
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('Prendre une photo'),
              onTap: () => Navigator.pop(ctx, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Choisir depuis la galerie'),
              onTap: () => Navigator.pop(ctx, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );
  }

  void _showRegistrationCardBottomSheet() {
    bool hasVerso = false;
    File? frontFile;
    File? backFile;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return SafeArea(
              child: Padding(
                padding: EdgeInsets.only(
                  bottom: MediaQuery.of(context).viewInsets.bottom,
                  left: 16, right: 16, top: 16
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text('Carte Grise', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 16),
                    Flexible(
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            const Text('Recto (Obligatoire)'),
                            const SizedBox(height: 8),
                            ElevatedButton.icon(
                              icon: const Icon(Icons.upload_file),
                              label: Text(frontFile == null ? 'Sélectionner le Recto' : 'Recto sélectionné'),
                              onPressed: () async {
                                final source = await _showImageSourcePicker();
                                if (source != null) {
                                  final XFile? img = await _picker.pickImage(source: source);
                                  if (img != null) {
                                    setModalState(() { frontFile = File(img.path); });
                                  }
                                }
                              },
                            ),
                            const SizedBox(height: 16),

                            SwitchListTile(
                              title: const Text('Nouvelle carte grise avec verso'),
                              value: hasVerso,
                              onChanged: (val) {
                                setModalState(() {
                                  hasVerso = val;
                                  if (!val) backFile = null;
                                });
                              },
                              contentPadding: EdgeInsets.zero,
                            ),
                            
                            if (hasVerso) ...[
                              const Text('Verso (Obligatoire)'),
                              const SizedBox(height: 8),
                              ElevatedButton.icon(
                                icon: const Icon(Icons.upload_file),
                                label: Text(backFile == null ? 'Sélectionner le Verso' : 'Verso sélectionné'),
                                onPressed: () async {
                                  final source = await _showImageSourcePicker();
                                  if (source != null) {
                                    final XFile? img = await _picker.pickImage(source: source);
                                    if (img != null) {
                                      setModalState(() { backFile = File(img.path); });
                                    }
                                  }
                                },
                              ),
                            ],
                            const SizedBox(height: 24),
                          ],
                        ),
                      ),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                      onPressed: () {
                        if (frontFile == null) {
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Veuillez sélectionner le recto.')));
                          return;
                        }
                        if (hasVerso && backFile == null) {
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Veuillez sélectionner le verso.')));
                          return;
                        }
                        Navigator.pop(ctx);
                        
                        final Map<String, File> files = {'frontFile': frontFile!};
                        if (hasVerso && backFile != null) {
                          files['backFile'] = backFile!;
                        }
                        _performUpload('REGISTRATION_CARD', files, isNewRegistrationCard: hasVerso);
                      },
                      child: const Text('Envoyer le document'),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            );
          }
        );
      }
    );
  }

  Future<void> _performUpload(String type, Map<String, File> files, {bool isNewRegistrationCard = false}) async {
    setState(() { _isLoading = true; });

    try {
      final fields = {'type': type};
      if (type == 'REGISTRATION_CARD' && isNewRegistrationCard) {
        fields['isNewRegistrationCard'] = 'true';
      }

      await ApiClient().multipartRequest(
        'POST',
        '/v1/drivers/me/vehicles/${widget.vehicleId}/documents',
        fields: fields,
        files: files,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Document envoyé avec succès pour validation.')));
      }
      await _fetchDocuments();
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _error = 'Erreur d\'envoi: ${e.toString()}';
        });
      }
    }
  }

  Future<void> _uploadDocument(String type) async {
    if (type == 'REGISTRATION_CARD') {
      _showRegistrationCardBottomSheet();
    } else {
      _showSimpleUploadBottomSheet(type);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Papiers du véhicule')),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : Column(
            children: [
              if (_error.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(8),
                  color: Colors.red.shade100,
                  width: double.infinity,
                  child: Text(_error, style: const TextStyle(color: Colors.red)),
                ),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    _buildDocItem('REGISTRATION_CARD', 'Carte Grise'),
                    _buildDocItem('INSURANCE', 'Assurance'),
                    _buildDocItem('TECHNICAL_INSPECTION', 'Visite Technique'),
                  ],
                ),
              ),
            ],
          ),
    );
  }

  Widget _buildDocItem(String type, String label) {
    final docs = _documents.where((d) => d['type'] == type).toList();
    docs.sort((a, b) => (b['createdAt'] ?? '').compareTo(a['createdAt'] ?? ''));
    final currentDoc = docs.isNotEmpty ? docs.first : null;
    
    String status = currentDoc?['status'] ?? 'MANQUANT';
    Color color = Colors.grey;
    if (status == 'APPROVED') {
      color = Colors.green;
    } else if (status == 'PENDING_REVIEW') {
      color = Colors.orange;
    } else if (status == 'REJECTED') {
      color = Colors.red;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              children: [
                const Text('Statut: ', style: TextStyle(color: Colors.grey)),
                Text(status, style: TextStyle(color: color, fontWeight: FontWeight.bold)),
              ],
            ),
            if (status == 'REJECTED' && currentDoc?['rejectionReason'] != null)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text('Motif: ${currentDoc['rejectionReason']}', style: const TextStyle(color: Colors.red)),
              ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => _uploadDocument(type),
              child: const Text('Ajouter / Remplacer'),
            )
          ],
        ),
      ),
    );
  }
}
