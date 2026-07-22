import 'dart:ui' as ui;
import 'package:flutter/rendering.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'dart:typed_data';
import 'dart:io';
import '../../widgets/shared_scaffold.dart'; 
import 'qr_code_screen.dart';
import 'package:gal/gal.dart';

class TicketImageGenerator {
  static Future<void> generateAndProcessTicket(BuildContext context, Map<String, dynamic> ticket, {required bool shareOnly}) async {
    final GlobalKey key = GlobalKey();
    
    final tripDate = DateTime.parse(ticket['trip']['departureTime']).toLocal();
    final dateStr = "${tripDate.day.toString().padLeft(2, '0')}/${tripDate.month.toString().padLeft(2, '0')}/${tripDate.year}";
    final timeStr = "${tripDate.hour.toString().padLeft(2, '0')}:${tripDate.minute.toString().padLeft(2, '0')}";
    final origin = ticket['trip']['route']['originStation']['city'];
    final dest = ticket['trip']['route']['destinationStation']['city'];
    final ref = ticket['qrCodeToken'];
    final publicRef = ticket['publicReference'] ?? 'VOY-${ticket['id'].toString().split('-')[0].toUpperCase()}';
    
    final passagers = ticket['passengersCount'] ?? ticket['passengerCount'] ?? ticket['places'] ?? 1;
    
    // Fallback passenger name
    String passenger = 'Passager';
    if (ticket['user'] != null && ticket['user']['firstName'] != null) {
      passenger = "${ticket['user']['firstName']} ${ticket['user']['lastName'] ?? ''}".trim();
    }
    
    int amountPaid = (ticket['amountPaid'] ?? 0).toInt();
    if (amountPaid == 0) {
      final basePrice = ticket['basePrice'] ?? 0;
      final fee = ticket['clientFee'] ?? 0;
      amountPaid = (basePrice + fee).toInt();
    }
    final priceStr = "$amountPaid FCFA";

    Widget ticketWidget = RepaintBoundary(
      key: key,
      child: Container(
        width: 400,
        color: Colors.white,
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.directions_car, color: Color(0xFFF97316), size: 32),
                const SizedBox(width: 8),
                const Text('Allogoo', style: TextStyle(color: Colors.black, fontSize: 28, fontWeight: FontWeight.w900)),
              ],
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFF97316).withOpacity(0.3), width: 2),
              ),
              child: QRCodeBrandEngine(value: ref, size: 200),
            ),
            const SizedBox(height: 16),
            const Text('Présentez ce QR code à l\'embarquement', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            Text('Billet $publicRef', style: const TextStyle(color: Colors.black, fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('$origin ➔ $dest', style: const TextStyle(color: Color(0xFFF97316), fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            _buildRow('Passager', passenger),
            _buildRow('Passagers', '$passagers'),
            _buildRow('Date & Heure', '$dateStr à $timeStr'),
            _buildRow('Montant total', priceStr),
          ],
        ),
      ),
    );

    final OverlayEntry entry = OverlayEntry(
      builder: (context) => Positioned(
        left: -9999,
        top: -9999,
        child: Material(
          type: MaterialType.transparency,
          child: ticketWidget,
        ),
      ),
    );

    Overlay.of(context).insert(entry);
    
    // Wait for render
    await Future.delayed(const Duration(milliseconds: 150));
    
    try {
      RenderRepaintBoundary boundary = key.currentContext!.findRenderObject() as RenderRepaintBoundary;
      ui.Image image = await boundary.toImage(pixelRatio: 3.0);
      ByteData? byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      Uint8List pngBytes = byteData!.buffer.asUint8List();
      
      final tempDir = await getTemporaryDirectory();
      final file = File('${tempDir.path}/billet-allogoo-$publicRef.png');
      await file.writeAsBytes(pngBytes);
      
      if (shareOnly) {
        final whatsappText = 'Billet Allogoo $publicRef';
        
        // We will share the file. The user can choose WhatsApp natively.
        await Share.shareXFiles([XFile(file.path)], text: whatsappText);
      } else {
        try {
          final hasAccess = await Gal.hasAccess();
          if (!hasAccess) {
            await Gal.requestAccess();
          }
          await Gal.putImage(file.path);
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Billet téléchargé avec succès', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                backgroundColor: Colors.green,
              ),
            );
          }
        } catch (e) {
          debugPrint('Erreur lors de la sauvegarde avec Gal: $e');
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Erreur lors du téléchargement. Vérifiez les permissions.', style: TextStyle(color: Colors.white)),
                backgroundColor: Colors.redAccent,
              ),
            );
          }
        }
      }
    } catch (e) {
      debugPrint('Error generating ticket image: $e');
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Erreur lors de la génération du billet')));
      }
    } finally {
      entry.remove();
    }
  }

  static Widget _buildRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.black54, fontSize: 14)),
          Text(value, style: const TextStyle(color: Colors.black, fontSize: 16, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
