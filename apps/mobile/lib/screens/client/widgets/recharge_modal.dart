import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:ui' as ui;
import '../../../widgets/orange_money_logo.dart';

void showRechargeModal(BuildContext context) async {
  int step = 1;
  String? operator;
  bool isLoading = false;
  final nameController = TextEditingController();
  final phoneController = TextEditingController();
  final amountController = TextEditingController();

  final prefs = await SharedPreferences.getInstance();
  final userName = prefs.getString('userName') ?? '';
  final userPhone = prefs.getString('userPhone') ?? '';
  
  nameController.text = userName;
  phoneController.text = userPhone;

  if (!context.mounted) return;

  showDialog(
    context: context,
    barrierDismissible: true,
    barrierColor: Colors.black.withValues(alpha: 0.6),
    builder: (context) {
      final isDark = Theme.of(context).brightness == Brightness.dark;
      final bgColor = isDark ? const Color(0xFF1A1A1A) : Colors.white;
      final headerBgColor = isDark ? const Color(0xFF141414).withValues(alpha: 0.5) : const Color(0xFFF8FAFC).withValues(alpha: 0.5);
      final borderColor = isDark ? const Color(0xFF333333) : const Color(0xFFE2E8F0);
      final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
      final textMutedColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);

      return Stack(
        children: [
          Positioned.fill(
            child: BackdropFilter(
              filter: ui.ImageFilter.blur(sigmaX: 4.0, sigmaY: 4.0),
              child: const SizedBox(),
            ),
          ),
          StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
              return Dialog(
                backgroundColor: Colors.transparent,
                insetPadding: const EdgeInsets.all(16),
                child: Container(
                  width: double.infinity,
                  constraints: const BoxConstraints(maxWidth: 500),
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withValues(alpha: 0.2), blurRadius: 24, spreadRadius: 0),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Header
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                        decoration: BoxDecoration(
                          color: headerBgColor,
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                          border: Border(bottom: BorderSide(color: borderColor)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  step == 3 ? 'Recharge réussie' : 'Recharger mon Wallet',
                                  style: TextStyle(color: textColor, fontSize: 20, fontWeight: FontWeight.w900),
                                ),
                                if (step < 3)
                                  Padding(
                                    padding: const EdgeInsets.only(top: 4),
                                    child: Text('Étape $step sur 2', style: TextStyle(color: textMutedColor, fontSize: 14)),
                                  ),
                              ],
                            ),
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: isDark ? const Color(0xFF222222) : Colors.white,
                                shape: BoxShape.circle,
                                border: Border.all(color: borderColor),
                              ),
                              child: IconButton(
                                icon: Icon(Icons.close, color: textMutedColor, size: 20),
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
                              ? _buildRechargeStep1(context, operator, (val) => setState(() => operator = val), isDark, borderColor)
                              : step == 2
                                  ? _buildRechargeStep2(context, operator, nameController, phoneController, amountController, isDark, borderColor, () => setState(() {}))
                                  : _buildRechargeStep3(context, amountController.text, operator, isDark),
                        ),
                      ),

                      // Footer Actions
                      if (step < 3)
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: headerBgColor,
                            borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
                            border: Border(top: BorderSide(color: borderColor)),
                          ),
                          child: Row(
                            children: [
                              if (step == 2)
                                Padding(
                                  padding: const EdgeInsets.only(right: 16),
                                  child: TextButton(
                                    onPressed: () => setState(() => step = 1),
                                    style: TextButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                      backgroundColor: isDark ? const Color(0xFF222222) : const Color(0xFFE2E8F0),
                                    ),
                                    child: Text('Retour', style: TextStyle(color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF475569), fontWeight: FontWeight.bold)),
                                  ),
                                ),
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: (step == 1 && operator == null) || 
                                             (step == 2 && (nameController.text.isEmpty || phoneController.text.isEmpty || amountController.text.isEmpty)) || 
                                             isLoading
                                      ? null
                                      : () async {
                                          if (step == 1) {
                                            setState(() => step = 2);
                                          } else if (step == 2) {
                                            setState(() => isLoading = true);
                                            await Future.delayed(const Duration(milliseconds: 1500));
                                            setState(() {
                                              isLoading = false;
                                              step = 3;
                                            });
                                          }
                                        },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: operator == 'wave' ? const Color(0xFF1da1f2) : operator == 'orange' ? const Color(0xFFFF7900) : (isDark ? Colors.white : const Color(0xFF0F172A)),
                                    foregroundColor: operator == null ? (isDark ? Colors.black : Colors.white) : Colors.white,
                                    disabledBackgroundColor: isDark ? const Color(0xFF222222) : const Color(0xFFCBD5E1),
                                    disabledForegroundColor: isDark ? Colors.white54 : Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 16),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                    elevation: 0,
                                  ),
                                  child: isLoading
                                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                      : Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Text(step == 1 ? 'Suivant' : 'Continuer', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                            const SizedBox(width: 8),
                                            const Icon(Icons.chevron_right, size: 20),
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

Widget _buildRechargeStep1(BuildContext context, String? selectedOperator, Function(String) onSelect, bool isDark, Color borderColor) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Choisissez votre opérateur', style: TextStyle(color: isDark ? Colors.white : const Color(0xFF0F172A), fontSize: 18, fontWeight: FontWeight.bold)),
      const SizedBox(height: 20),
      Row(
        children: [
          Expanded(
            child: _buildOperatorCard('wave', selectedOperator, onSelect, isDark, borderColor),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: _buildOperatorCard('orange', selectedOperator, onSelect, isDark, borderColor),
          ),
        ],
      ),
    ],
  );
}

Widget _buildOperatorCard(String op, String? selectedOperator, Function(String) onSelect, bool isDark, Color borderColor) {
  final isWave = op == 'wave';
  final isSelected = selectedOperator == op;
  final mainColor = isWave ? const Color(0xFF1da1f2) : const Color(0xFFFF7900);
  
  return GestureDetector(
    onTap: () => onSelect(op),
    child: AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isSelected ? mainColor.withValues(alpha: 0.05) : (isDark ? const Color(0xFF141414) : Colors.white),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isSelected ? mainColor : borderColor,
          width: 2,
        ),
      ),
      child: Column(
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: isWave ? mainColor : Colors.black,
                  borderRadius: isWave ? BorderRadius.circular(32) : BorderRadius.circular(16),
                  border: isWave ? null : Border.all(color: mainColor.withValues(alpha: 0.2)),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 10),
                  ]
                ),
                child: isWave ? CustomPaint(painter: WavePainter()) : const OrangeMoneyLogo(size: 64),
              ),
              if (isSelected)
                Positioned(
                  top: -8,
                  right: -8,
                  child: Container(
                    decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                    child: Icon(Icons.check_circle, color: mainColor, size: 24),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            isWave ? 'Wave Mobile Money' : 'Orange Money',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isSelected ? mainColor : (isDark ? const Color(0xFFCBD5E1) : const Color(0xFF334155)),
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    ),
  );
}

Widget _buildRechargeStep2(BuildContext context, String? operator, TextEditingController nameCtrl, TextEditingController phoneCtrl, TextEditingController amountCtrl, bool isDark, Color borderColor, VoidCallback onInputChanged) {
  final isWave = operator == 'wave';
  final opColor = isWave ? const Color(0xFF1da1f2) : const Color(0xFFFF7900);
  final inputBg = isDark ? const Color(0xFF1A1A1A) : Colors.white;

  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF141414) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: borderColor),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: isWave ? opColor : Colors.black,
                borderRadius: BorderRadius.circular(12),
                border: isWave ? null : Border.all(color: opColor.withValues(alpha: 0.3)),
              ),
              child: isWave ? CustomPaint(painter: WavePainter()) : const OrangeMoneyLogo(size: 48),
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Recharge via', style: TextStyle(color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B), fontSize: 14)),
                Text(isWave ? 'Wave Mobile Money' : 'Orange Money', style: TextStyle(color: isDark ? Colors.white : const Color(0xFF0F172A), fontWeight: FontWeight.bold, fontSize: 16)),
              ],
            )
          ],
        ),
      ),
      const SizedBox(height: 24),
      _buildWizardInput(context, 'Nom Complet', Icons.person, 'Ex: Abdou Bakhe', controller: nameCtrl, isDark: isDark, borderColor: borderColor, inputBg: inputBg, onChanged: (_) => onInputChanged()),
      const SizedBox(height: 16),
      _buildWizardInput(context, 'Numéro de Téléphone', Icons.phone, 'Ex: 77 123 45 67', isNumber: true, controller: phoneCtrl, isDark: isDark, borderColor: borderColor, inputBg: inputBg, onChanged: (_) => onInputChanged()),
      const SizedBox(height: 16),
      _buildWizardInput(context, 'Montant à Recharger (FCFA)', Icons.credit_card, 'Ex: 10000', isNumber: true, isLarge: true, controller: amountCtrl, isDark: isDark, borderColor: borderColor, inputBg: inputBg, onChanged: (_) => onInputChanged()),
    ],
  );
}

Widget _buildRechargeStep3(BuildContext context, String amount, String? operator, bool isDark) {
  return Padding(
    padding: const EdgeInsets.symmetric(vertical: 32),
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 96,
          height: 96,
          decoration: BoxDecoration(
            color: const Color(0xFF10B981).withValues(alpha: 0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.check_circle, color: const Color(0xFF10B981), size: 48),
        ),
        const SizedBox(height: 24),
        Text('Demande Envoyée !', style: TextStyle(color: isDark ? Colors.white : const Color(0xFF0F172A), fontSize: 24, fontWeight: FontWeight.w900)),
        const SizedBox(height: 8),
        Text(
          'Veuillez valider le paiement de $amount FCFA sur votre téléphone via l\'application ${operator == 'wave' ? 'Wave' : 'Orange Money'}.', 
          textAlign: TextAlign.center, 
          style: TextStyle(color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B), fontSize: 16)
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: () => Navigator.pop(context),
          style: ElevatedButton.styleFrom(
            backgroundColor: isDark ? Colors.white : const Color(0xFF0F172A),
            foregroundColor: isDark ? const Color(0xFF0F172A) : Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: const Text('Retour au Wallet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        ),
      ],
    ),
  );
}

Widget _buildWizardInput(BuildContext context, String label, IconData icon, String hint, {TextEditingController? controller, bool isNumber = false, bool isLarge = false, required bool isDark, required Color borderColor, required Color inputBg, void Function(String)? onChanged}) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(label, style: TextStyle(color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF334155), fontSize: 14, fontWeight: FontWeight.bold)),
      const SizedBox(height: 8),
      TextField(
        controller: controller,
        onChanged: onChanged,
        keyboardType: isNumber ? TextInputType.number : TextInputType.text,
        style: TextStyle(color: isDark ? Colors.white : const Color(0xFF0F172A), fontSize: isLarge ? 18 : 16, fontWeight: isLarge ? FontWeight.w900 : FontWeight.w500),
        decoration: InputDecoration(
          filled: true,
          fillColor: inputBg,
          prefixIcon: Icon(icon, color: const Color(0xFF94A3B8)),
          hintText: hint,
          hintStyle: TextStyle(color: const Color(0xFF94A3B8), fontWeight: FontWeight.normal),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: borderColor),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: borderColor),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: const Color(0xFF64748B)),
          ),
          contentPadding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
    ],
  );
}

class WavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Wave viewBox is 0 0 200 260. We will scale to fill our container nicely.
    final double scale = size.width / 260; // Slightly smaller to add padding
    canvas.translate(size.width / 2, size.height / 2);
    canvas.scale(scale, scale);
    canvas.translate(-100, -130);
    
    final Paint blackPaint = Paint()..color = Colors.black;
    final Paint whitePaint = Paint()..color = Colors.white;
    final Paint orangePaint = Paint()..color = const Color(0xFFF7931E);
    
    canvas.drawRRect(RRect.fromRectAndRadius(const Rect.fromLTWH(50, 20, 100, 190), const Radius.circular(50)), blackPaint);
    
    canvas.save();
    canvas.translate(20, 80);
    canvas.rotate(-40 * 3.14159 / 180);
    canvas.drawRRect(RRect.fromRectAndRadius(const Rect.fromLTWH(0, 0, 40, 90), const Radius.circular(20)), blackPaint);
    canvas.restore();
    
    canvas.drawOval(const Rect.fromLTWH(100 - 28, 140 - 55, 56, 110), whitePaint);
    canvas.drawCircle(const Offset(82, 55), 7, whitePaint);
    canvas.drawCircle(const Offset(118, 55), 7, whitePaint);
    
    final Path orangePath = Path()
      ..moveTo(75, 80)
      ..quadraticBezierTo(100, 98, 125, 80)
      ..quadraticBezierTo(100, 70, 75, 80)
      ..close();
    canvas.drawPath(orangePath, orangePaint);
    
    canvas.drawOval(const Rect.fromLTWH(75 - 22, 220 - 12, 44, 24), orangePaint);
    canvas.drawOval(const Rect.fromLTWH(125 - 22, 220 - 12, 44, 24), orangePaint);
  }
  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
