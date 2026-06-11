import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../widgets/shared_scaffold.dart';

class QrCodeScreen extends StatelessWidget {
  const QrCodeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SharedScaffold(
      title: 'QR Code & Billets',
      subtitle: 'Vos titres de transport toujours à portée de main.',
      icon: Icons.qr_code_scanner,
      iconColor: Colors.purpleAccent,
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Vos billets, réservations et historiques de voyage.',
              style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14),
            ),
            SizedBox(height: 24),
            
            // Search Bar
            Container(
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
              ),
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: TextField(
                style: TextStyle(color: Theme.of(context).colorScheme.onSurface),
                decoration: InputDecoration(
                  icon: Icon(Icons.search, color: Theme.of(context).colorScheme.onSurfaceVariant),
                  border: InputBorder.none,
                  hintText: 'Rechercher un QR code, trajet...',
                  hintStyle: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.30)),
                ),
              ),
            ),
            SizedBox(height: 32),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Liste de mes QR codes', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.orangeAccent.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.orangeAccent.withValues(alpha: 0.3)),
                  ),
                  child: Text('1 Billet actif', style: TextStyle(color: Colors.orangeAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            SizedBox(height: 16),
            
            // Ticket 1 (Active)
            _buildTicketCard(
              context,
              isActive: true,
              status: 'Confirmé (Escrow)',
              ref: 'AR-74892374',
              date: '18 Mai 2026',
              time: '08:00',
              from: 'Dakar',
              to: 'Touba',
              ticketNo: 'TKT-0014',
              seat: '#14 (VIP)',
              passenger: 'Abdou Bakhe',
              vehicle: 'Bus Climatisé',
              price: '4 500 FCFA',
            ),
            SizedBox(height: 24),
            
            // Ticket 2 (History)
            Opacity(
              opacity: 0.6,
              child: _buildTicketCard(
                context,
                isActive: false,
                status: 'Terminé',
                ref: 'AR-12984756',
                date: '10 Mai 2026',
                time: '14:30',
                from: 'Touba',
                to: 'Dakar',
                ticketNo: 'TKT-0089',
                seat: '#02 (VIP)',
                passenger: 'Abdou Bakhe',
                vehicle: 'Minibus',
                price: '4 500 FCFA',
              ),
            ),
            SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildTicketCard(
    BuildContext context, {
    required bool isActive,
    required String status,
    required String ref,
    required String date,
    required String time,
    required String from,
    required String to,
    required String ticketNo,
    required String seat,
    required String passenger,
    required String vehicle,
    required String price,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: isActive ? Colors.orangeAccent.withValues(alpha: 0.5) : Colors.white10),
        boxShadow: isActive ? [BoxShadow(color: Colors.orangeAccent.withValues(alpha: 0.1), blurRadius: 20, offset: const Offset(0, 10))] : null,
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          // Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: isActive ? Colors.orangeAccent : const Color(0xFF1E293B),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Icon(Icons.check_circle, color: isActive ? Colors.white : Colors.white54, size: 16),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          'Statut: $status', 
                          style: TextStyle(color: isActive ? Colors.white : Colors.white54, fontSize: 12, fontWeight: FontWeight.bold),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Text('Réf: $ref', style: TextStyle(color: isActive ? Colors.white : Colors.white54, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
              ],
            ),
          ),
          
          // Main Body
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header (Route + QR)
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.calendar_month, color: isActive ? Colors.orangeAccent : Colors.white54, size: 14),
                              const SizedBox(width: 4),
                              Text(date, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                              Padding(padding: const EdgeInsets.symmetric(horizontal: 8), child: Text('•', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.30)))),
                              Icon(Icons.access_time, color: isActive ? Colors.orangeAccent : Colors.white54, size: 14),
                              const SizedBox(width: 4),
                              Text(time, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Text(from, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.w900)),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 8),
                                child: Icon(Icons.arrow_forward, color: isActive ? Colors.orangeAccent : Colors.white38, size: 20),
                              ),
                              Text(to, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.w900)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Icon(Icons.directions_bus, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.38), size: 14),
                              const SizedBox(width: 4),
                              Text('Sénégal Express', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    // QR Code Image (Real)
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.onSurface,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
                      ),
                      child: QRCodeBrandEngine(value: ref, size: 75),
                    ),
                  ],
                ),
                
                if (isActive) ...[
                  const SizedBox(height: 24),
                  // Details Grid
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.03),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Expanded(child: _buildDetailField(context, 'N° Billet', ticketNo)),
                            Expanded(child: _buildDetailField(context, 'Siège', seat, valueColor: Colors.orangeAccent)),
                            Expanded(child: _buildDetailField(context, 'Passager', passenger)),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Row(
                          children: [
                            Expanded(child: _buildDetailField(context, 'Véhicule', vehicle)),
                            Expanded(flex: 2, child: _buildDetailField(context, 'Montant Payé', price)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            _showTicketDetails(context, ref, passenger, from, to, date, time, seat, price);
                          },
                          icon: Icon(Icons.visibility, color: Theme.of(context).colorScheme.onSurface),
                          label: Text('Détails', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24)),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Téléchargement du billet...')));
                          },
                          icon: Icon(Icons.download, color: Theme.of(context).colorScheme.onSurface),
                          label: const Text('Télécharger'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orangeAccent,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            textStyle: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
                if (!isActive) ...[
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Historique...')));
                      },
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text('Voir l\'historique complet', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailField(BuildContext context, String label, String value, {Color valueColor = Colors.white}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(color: valueColor, fontSize: 13, fontWeight: FontWeight.w900), maxLines: 1, overflow: TextOverflow.ellipsis),
      ],
    );
  }

  void _showTicketDetails(BuildContext context, String ref, String passenger, String from, String to, String date, String time, String seat, String price) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        decoration: BoxDecoration(color: Theme.of(context).cardColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24), borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: Theme.of(context).colorScheme.onSurface, borderRadius: BorderRadius.circular(24)),
              child: QRCodeBrandEngine(value: ref, size: 180),
            ),
            const SizedBox(height: 24),
            Text('Billet N° $ref', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('$from ➔ $to', style: const TextStyle(color: Colors.orangeAccent, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            _buildDetailRow(context, 'Passager', passenger),
            _buildDetailRow(context, 'Date & Heure', '$date à $time'),
            _buildDetailRow(context, 'Siège', seat),
            _buildDetailRow(context, 'Montant payé', price),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white10,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: const Text('Fermer'),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(BuildContext context, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 15)),
          Text(value, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 15, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class QRCodeBrandEngine extends StatelessWidget {
  final String value;
  final double size;

  const QRCodeBrandEngine({
    super.key,
    required this.value,
    this.size = 80,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          QrImageView(
            data: value,
            version: QrVersions.auto,
            errorCorrectionLevel: QrErrorCorrectLevel.H,
            size: size,
            backgroundColor: Colors.white,
            eyeStyle: const QrEyeStyle(
              eyeShape: QrEyeShape.square, // Keep eyes square for contrast
              color: Color(0xFFE65100), // deep orange
            ),
            dataModuleStyle: const QrDataModuleStyle(
              dataModuleShape: QrDataModuleShape.circle, // Make data modules dots
              color: Colors.black87,
            ),
            padding: const EdgeInsets.all(4),
          ),
          // Logo in the center
          Container(
            width: size * 0.3,
            height: size * 0.3,
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.onSurface,
              borderRadius: BorderRadius.circular(size * 0.08),
              border: Border.all(color: Colors.deepOrangeAccent, width: 1.5),
            ),
            child: Center(
              child: Icon(Icons.directions_car, color: Colors.deepOrange, size: size * 0.18),
            ),
          ),
        ],
      ),
    );
  }
}
