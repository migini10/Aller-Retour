import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'dart:math';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:geolocator/geolocator.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../widgets/orange_money_logo.dart';

void showColisModal(BuildContext context) {
  int step = 1;
  bool isLoading = false;
  
  final departController = TextEditingController();
  final quartierDepartController = TextEditingController();
  final arriveeController = TextEditingController();
  final quartierArriveeController = TextEditingController();
  final destNomController = TextEditingController();
  final destTelController = TextEditingController();
  String? taille = 'Moyen';
  String modePaiement = 'Wave';
  String? generatedTicket;

  StateSetter? modalSetState;

  void onInputChanged() {
    modalSetState?.call(() {});
  }

  departController.addListener(onInputChanged);
  quartierDepartController.addListener(onInputChanged);
  arriveeController.addListener(onInputChanged);
  quartierArriveeController.addListener(onInputChanged);
  destNomController.addListener(onInputChanged);
  destTelController.addListener(onInputChanged);

  showDialog(
    context: context,
    barrierDismissible: true,
    barrierColor: Colors.black.withValues(alpha: 0.4),
    builder: (context) {
      return Stack(
        children: [
          Positioned.fill(
            child: BackdropFilter(
              filter: ui.ImageFilter.blur(sigmaX: 8.0, sigmaY: 8.0),
              child: const SizedBox(),
            ),
          ),
          StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
              modalSetState = setState;
              return Dialog(
                backgroundColor: Colors.transparent,
                insetPadding: const EdgeInsets.all(16),
                child: Container(
                  width: 400,
                  constraints: BoxConstraints(
                    minHeight: 500,
                    maxHeight: MediaQuery.of(context).size.height * 0.9,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withValues(alpha: 0.5), blurRadius: 24, spreadRadius: 8),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Header
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                        decoration: BoxDecoration(color: Theme.of(context).cardColor,
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                          border: Border(bottom: BorderSide(color: Theme.of(context).dividerColor)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  step == 4 ? 'Reçu de Colis' : 'Envoi de Colis',
                                  style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 20, fontWeight: FontWeight.w900),
                                ),
                                if (step < 4)
                                  Padding(
                                    padding: const EdgeInsets.only(top: 4),
                                    child: Text('Étape $step sur 3', style: const TextStyle(color: Colors.orangeAccent, fontSize: 13, fontWeight: FontWeight.bold)),
                                  ),
                              ],
                            ),
                            Container(
                              decoration: BoxDecoration(
                                color: Theme.of(context).cardColor,
                                borderRadius: BorderRadius.circular(24),
                                border: Border.all(color: Theme.of(context).dividerColor),
                              ),
                              child: IconButton(
                                icon: Icon(Icons.close, color: Theme.of(context).colorScheme.onSurfaceVariant),
                                onPressed: () => Navigator.pop(context),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Content
                      Flexible(
                        child: SingleChildScrollView(
                          padding: const EdgeInsets.all(24),
                          child: step == 1
                              ? _buildStep1(context, departController, quartierDepartController, arriveeController, quartierArriveeController, () async {
                                  FocusScope.of(context).unfocus();
                                  bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
                                  if (!serviceEnabled) return;
                                  LocationPermission permission = await Geolocator.checkPermission();
                                  if (permission == LocationPermission.denied) {
                                    permission = await Geolocator.requestPermission();
                                    if (permission == LocationPermission.denied) return;
                                  }
                                  Position position = await Geolocator.getCurrentPosition();
                                  const apiKey = 'AIzaSyBEcIPoabk6yTJNGU06FjC5251syM9FGqA';
                                  final url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.latitude},${position.longitude}&key=$apiKey';
                                  try {
                                    final response = await http.get(Uri.parse(url));
                                    if (response.statusCode == 200) {
                                      final data = json.decode(response.body);
                                      if (data['status'] == 'OK') {
                                        final components = data['results'][0]['address_components'] as List;
                                        String? quartier;
                                        for (var component in components) {
                                          final types = component['types'] as List;
                                          if (types.contains('neighborhood') || types.contains('sublocality') || types.contains('sublocality_level_1') || types.contains('route')) {
                                            quartier = component['long_name'];
                                            if (types.contains('neighborhood') || types.contains('sublocality')) break;
                                          }
                                        }
                                        setState(() {
                                          departController.text = data['results'][0]['formatted_address'];
                                          if (quartier != null) {
                                            quartierDepartController.text = quartier;
                                          }
                                        });
                                      }
                                    }
                                  } catch (e) {}
                                })
                              : step == 2
                                  ? _buildStep2(context, destNomController, destTelController, taille, (val) => setState(() => taille = val))
                                  : step == 3
                                      ? _buildStep3Payment(context, modePaiement, (val) => setState(() => modePaiement = val))
                                      : _buildStep4Ticket(context, departController.text, arriveeController.text, destNomController.text, destTelController.text, taille, generatedTicket),
                        ),
                      ),

                      // Footer Actions
                      if (step < 4)
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(color: Theme.of(context).cardColor,
                            borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
                            border: Border(top: BorderSide(color: Theme.of(context).dividerColor)),
                          ),
                          child: Row(
                            children: [
                              if (step > 1)
                                Padding(
                                  padding: const EdgeInsets.only(right: 16),
                                  child: TextButton(
                                    onPressed: () => setState(() => step = step - 1),
                                    style: TextButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                      backgroundColor: Theme.of(context).cardColor,
                                    ),
                                    child: Text('Retour', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)),
                                  ),
                                ),
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: isLoading
                                      ? null
                                      : () async {
                                          if (step == 1) {
                                            if (departController.text.isEmpty || arriveeController.text.isEmpty) {
                                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Veuillez renseigner les adresses de départ et d\'arrivée.')));
                                              return;
                                            }
                                            setState(() => step = 2);
                                          } else if (step == 2) {
                                            if (destNomController.text.isEmpty || destTelController.text.isEmpty) {
                                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Veuillez remplir les informations du destinataire.')));
                                              return;
                                            }
                                            setState(() => step = 3);
                                          } else if (step == 3) {
                                            setState(() => isLoading = true);
                                            try {
                                              final response = await http.post(
                                                Uri.parse('http://localhost:3000/api/colis'),
                                                headers: {'Content-Type': 'application/json'},
                                                body: jsonEncode({
                                                  'destinataire': destNomController.text,
                                                  'tel': destTelController.text,
                                                  'taille': taille ?? 'Moyen (5-15kg)',
                                                }),
                                              );
                                              if (response.statusCode == 200) {
                                                final data = jsonDecode(response.body);
                                                setState(() {
                                                  isLoading = false;
                                                  generatedTicket = data['parcel']['trackingCode'];
                                                  step = 4;
                                                });
                                              } else {
                                                setState(() => isLoading = false);
                                              }
                                            } catch (e) {
                                              debugPrint('Error: $e');
                                              setState(() => isLoading = false);
                                            }
                                          }
                                        },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.orangeAccent,
                                    foregroundColor: Colors.white,
                                    disabledBackgroundColor: const Color(0xFF222222),
                                    disabledForegroundColor: Colors.white54,
                                    padding: const EdgeInsets.symmetric(vertical: 16),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                  ),
                                  child: isLoading
                                      ? SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Theme.of(context).colorScheme.onSurface, strokeWidth: 2))
                                      : Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Flexible(child: Text(step == 3 ? 'Valider et créer le reçu' : 'Continuer', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16), overflow: TextOverflow.ellipsis)),
                                            const SizedBox(width: 8),
                                            Icon(step == 3 ? Icons.check_circle : Icons.arrow_forward),
                                          ],
                                        ),
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      );
    },
  );
}

Widget _buildStep1(BuildContext context, TextEditingController depart, TextEditingController qDepart, TextEditingController arrivee, TextEditingController qArrivee, VoidCallback onLocateMe) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Où envoyer votre colis ?', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
      const SizedBox(height: 20),
      _buildPlacesAutocomplete(context, const ValueKey('depart'), 'Adresse de retrait (Expéditeur)', depart, icon: Icons.location_on, iconColor: Colors.white54, suffixIcon: IconButton(
        icon: const Icon(Icons.my_location, color: Colors.orangeAccent),
        onPressed: onLocateMe,
        tooltip: 'Me localiser',
      )),
      const SizedBox(height: 12),
      _buildPlacesAutocomplete(context, const ValueKey('qDepart'), 'Sous-quartier de retrait exact', qDepart, icon: Icons.home, iconColor: Colors.white54),
      const SizedBox(height: 16),
      _buildPlacesAutocomplete(context, const ValueKey('arrivee'), 'Adresse de livraison (Destinataire)', arrivee, icon: Icons.location_on, iconColor: Colors.orangeAccent),
      const SizedBox(height: 12),
      _buildPlacesAutocomplete(context, const ValueKey('qArrivee'), 'Sous-quartier de livraison exact', qArrivee, icon: Icons.home, iconColor: Colors.orangeAccent),
    ],
  );
}

Widget _buildStep2(BuildContext context, TextEditingController nom, TextEditingController tel, String? taille, Function(String) onTailleSelect) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Détails du destinataire', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
      const SizedBox(height: 20),
      _buildWizardInput(context, 'Nom complet du destinataire', Icons.person, 'Ex: Aminata Fall', controller: nom),
      const SizedBox(height: 16),
      _buildWizardInput(context, 'Numéro de téléphone', Icons.phone_android, 'Ex: 77 123 45 67', isNumber: true, controller: tel),
      const SizedBox(height: 24),
      Text('Taille du Colis', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
      const SizedBox(height: 12),
      Row(
        children: [
          Expanded(child: _buildTailleOption(context, 'Enveloppe', Icons.email, 'Documents', taille == 'Enveloppe', () => onTailleSelect('Enveloppe'))),
          const SizedBox(width: 8),
          Expanded(child: _buildTailleOption(context, 'Petit', Icons.inventory_2, 'Boîte', taille == 'Petit', () => onTailleSelect('Petit'))),
        ],
      ),
      const SizedBox(height: 8),
      Row(
        children: [
          Expanded(child: _buildTailleOption(context, 'Moyen', Icons.inventory, 'Valise', taille == 'Moyen', () => onTailleSelect('Moyen'))),
          const SizedBox(width: 8),
          Expanded(child: _buildTailleOption(context, 'Grand', Icons.archive, 'Carton', taille == 'Grand', () => onTailleSelect('Grand'))),
        ],
      ),
    ],
  );
}

Widget _buildTailleOption(BuildContext context, String title, IconData icon, String desc, bool isSelected, VoidCallback onTap) {
  return GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: isSelected ? Colors.orangeAccent.withValues(alpha: 0.1) : Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected ? Colors.orangeAccent : Colors.white10,
        ),
      ),
      child: Column(
        children: [
          Icon(icon, color: isSelected ? Colors.orangeAccent : Colors.white54),
          const SizedBox(height: 8),
          Text(title, style: TextStyle(color: isSelected ? Colors.white : Colors.white70, fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 2),
          Text(desc, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 10)),
        ],
      ),
    ),
  );
}

Widget _buildStep3Payment(BuildContext context, String modePaiement, Function(String) onModeSelected) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Mode de paiement', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
      const SizedBox(height: 8),
      Text('Comment souhaitez-vous payer l\'envoi ?', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
      const SizedBox(height: 20),
      
      _buildPaymentOption(context, 'Wave', 'Payer via l\'application Wave', Icons.phone_android, modePaiement, onModeSelected),
      const SizedBox(height: 12),
      _buildPaymentOption(context, 'Orange Money', 'Payer via Orange Money', Icons.phone_android, modePaiement, onModeSelected, customIcon: const OrangeMoneyLogo(size: 20)),
      const SizedBox(height: 12),
      _buildPaymentOption(context, 'Wallet', 'Paiement instantané via votre portefeuille', Icons.account_balance_wallet, modePaiement, onModeSelected),
    ],
  );
}

Widget _buildPaymentOption(BuildContext context, String id, String desc, IconData icon, String currentMode, Function(String) onModeSelected, {Widget? customIcon}) {
  bool isSelected = currentMode == id;
  return InkWell(
    onTap: () => onModeSelected(id),
    borderRadius: BorderRadius.circular(16),
    child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isSelected ? Colors.orangeAccent.withValues(alpha: 0.15) : Theme.of(context).cardColor,
        border: Border.all(color: isSelected ? Colors.orangeAccent : const Color(0xFF333333)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isSelected ? Colors.orangeAccent : const Color(0xFF222222),
              shape: BoxShape.circle,
            ),
            child: customIcon ?? Icon(icon, color: isSelected ? Colors.white : Colors.white54, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(id, style: TextStyle(color: isSelected ? Colors.orangeAccent : Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                Text(desc, style: TextStyle(color: isSelected ? Colors.orangeAccent.withValues(alpha: 0.7) : Colors.white54, fontSize: 12)),
              ],
            ),
          ),
          if (isSelected) const Icon(Icons.check_circle, color: Colors.orangeAccent),
        ],
      ),
    ),
  );
}

Widget _buildStep4Ticket(BuildContext context, String depart, String arrivee, String nom, String tel, String? taille, String? ticket) {
  return Padding(
    padding: const EdgeInsets.symmetric(vertical: 20),
    child: Column(
      children: [
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Theme.of(context).dividerColor,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('REÇU DE COLIS', style: TextStyle(color: Colors.orangeAccent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
                      const SizedBox(height: 4),
                      Text(ticket ?? '', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.w900)),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.orangeAccent.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.inventory_2, color: Colors.orangeAccent),
                  )
                ],
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(12)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Trajet', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 10)),
                    const SizedBox(height: 4),
                    Text('$depart → $arrivee', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(12)),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('DESTINATAIRE', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 9)),
                          const SizedBox(height: 4),
                          Text(nom, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 13)),
                          const SizedBox(height: 2),
                          Text(tel, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 11)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(12)),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('TAILLE', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 9)),
                          const SizedBox(height: 4),
                          Text(taille ?? '', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 13)),
                          const SizedBox(height: 18), // Pour aligner avec l'autre colonne
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Center(
                child: Container(
                  width: 140,
                  height: 140,
                  color: Theme.of(context).colorScheme.onSurface,
                  child: const Center(child: Icon(Icons.qr_code, size: 100, color: Colors.black)),
                ),
              ),
              const SizedBox(height: 16),
              Center(child: Text('À présenter au chauffeur lors du dépôt.', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 11))),
            ],
          ),
        ),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () => Navigator.pop(context),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 50),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          child: const Text('Fermer', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 16)),
        ),
      ],
    ),
  );
}

Widget _buildWizardInput(BuildContext context, String hint, IconData icon, String example, {bool isNumber = false, TextEditingController? controller, Color iconColor = Colors.white54}) {
  return TextField(
    controller: controller,
    keyboardType: isNumber ? TextInputType.number : TextInputType.text,
    style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14, fontWeight: FontWeight.w600),
    decoration: InputDecoration(
      filled: true,
      fillColor: Colors.white.withValues(alpha: 0.05),
      prefixIcon: Icon(icon, color: iconColor),
      hintText: hint,
      hintStyle: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.30)),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Theme.of(context).dividerColor),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Theme.of(context).dividerColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.orangeAccent),
      ),
      contentPadding: const EdgeInsets.symmetric(vertical: 16),
    ),
    onChanged: (val) {
      if (controller != null) {
        // Trigger a fake rebuild if needed, though stateful builder won't rebuild this automatically unless setState is passed
      }
    },
  );
}

Widget _buildPlacesAutocomplete(BuildContext context, Key key, String hint, TextEditingController mainController, {IconData? icon, Color iconColor = Colors.white54, Widget? suffixIcon, Function(String, String?)? onSelectedAddress}) {
  return Autocomplete<Map<String, dynamic>>(
    key: key,
    displayStringForOption: (option) => option['description'] as String,
    optionsBuilder: (TextEditingValue textEditingValue) async {
      if (textEditingValue.text.length < 2) return const Iterable<Map<String, dynamic>>.empty();
      const apiKey = 'AIzaSyBEcIPoabk6yTJNGU06FjC5251syM9FGqA';
      final url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${Uri.encodeComponent(textEditingValue.text)}&components=country:sn&key=$apiKey';
      try {
        final response = await http.get(Uri.parse(url));
        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          if (data['status'] == 'OK') {
            return (data['predictions'] as List).map<Map<String, dynamic>>((p) => {
              'description': p['description'] as String,
              'main_text': p['structured_formatting']['main_text'] as String
            }).toList();
          }
        }
      } catch (e) {}
      return const Iterable<Map<String, dynamic>>.empty();
    },
    onSelected: (Map<String, dynamic> selection) {
      mainController.text = selection['description'] as String;
      if (onSelectedAddress != null) {
        onSelectedAddress(selection['description'] as String, selection['main_text'] as String?);
      }
    },
    fieldViewBuilder: (BuildContext context, TextEditingController textEditingController, FocusNode focusNode, VoidCallback onFieldSubmitted) {
      if (textEditingController.text != mainController.text && !focusNode.hasFocus) {
        textEditingController.text = mainController.text;
      }
      return TextField(
        controller: textEditingController,
        focusNode: focusNode,
        style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14),
        decoration: InputDecoration(
          filled: true,
          fillColor: Colors.white.withValues(alpha: 0.05),
          prefixIcon: icon != null ? Icon(icon, color: iconColor) : null,
          suffixIcon: suffixIcon,
          hintText: hint,
          hintStyle: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.30)),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Theme.of(context).dividerColor)),
          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Theme.of(context).dividerColor)),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.orangeAccent)),
          contentPadding: const EdgeInsets.symmetric(vertical: 16),
        ),
        onChanged: (val) => mainController.text = val,
      );
    },
    optionsViewBuilder: (BuildContext context, AutocompleteOnSelected<Map<String, dynamic>> onSelected, Iterable<Map<String, dynamic>> options) {
      return Align(
        alignment: Alignment.topLeft,
        child: Material(
          elevation: 8,
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(12),
          child: Container(
            width: 330,
            constraints: const BoxConstraints(maxHeight: 200),
            child: ListView.builder(
              padding: const EdgeInsets.all(8),
              itemCount: options.length,
              shrinkWrap: true,
              itemBuilder: (BuildContext context, int index) {
                final option = options.elementAt(index);
                return InkWell(
                  onTap: () => onSelected(option),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(border: Border(bottom: BorderSide(color: Theme.of(context).dividerColor))),
                    child: Text(option['description'] as String, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14)),
                  ),
                );
              },
            ),
          ),
        ),
      );
    },
  );
}
