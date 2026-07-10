import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:ui' as ui;
import '../../../services/api_client.dart';
import '../../../widgets/orange_money_logo.dart';
import '../../client/widgets/recharge_modal.dart'; // To reuse WavePainter

void showWithdrawalModal(BuildContext context, int maxAmount, VoidCallback onCompleted) async {
  int step = 1;
  String? operator;
  bool isLoading = false;
  String errorMessage = '';
  final nameController = TextEditingController();
  final phoneController = TextEditingController();
  final amountController = TextEditingController();

  final prefs = await SharedPreferences.getInstance();
  final userName = prefs.getString('userName') ?? 'Chauffeur';
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
              
              Future<void> submitWithdrawal() async {
                final numericAmount = int.tryParse(amountController.text) ?? 0;
                if (numericAmount <= 0) {
                  setState(() => errorMessage = 'Veuillez entrer un montant valide.');
                  return;
                }
                if (numericAmount > maxAmount) {
                  setState(() => errorMessage = 'Solde insuffisant.');
                  return;
                }

                setState(() {
                  isLoading = true;
                  errorMessage = '';
                });

                try {
                  final response = await ApiClient().post(
                    '/v1/wallets/driver-withdrawal',
                    body: {
                      'operator': operator,
                      'amount': numericAmount,
                      'phone': phoneController.text,
                      'fullName': nameController.text
                    },
                  );

                  if (response.statusCode == 201 || response.statusCode == 200) {
                    setState(() {
                      isLoading = false;
                      step = 3;
                    });
                    onCompleted();
                  }
                } on ApiException catch (e) {
                  setState(() {
                    isLoading = false;
                  });
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(e.message)),
                    );
                  }
                } catch (e) {
                  setState(() {
                    isLoading = false;
                  });
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Erreur: $e')),
                    );
                  }
                }
              }

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
                                  step == 3 ? 'Retrait initié' : 'Retirer mes gains',
                                  style: TextStyle(color: textColor, fontSize: 20, fontWeight: FontWeight.w900),
                                ),
                                if (step < 3)
                                  Padding(
                                    padding: const EdgeInsets.only(top: 4),
                                    child: Text('Étape $step sur 2 • Solde : $maxAmount F', style: TextStyle(color: textMutedColor, fontSize: 14)),
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
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (errorMessage.isNotEmpty)
                                Container(
                                  margin: const EdgeInsets.only(bottom: 16),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.red.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(color: Colors.red.withValues(alpha: 0.2)),
                                  ),
                                  child: Row(
                                    children: [
                                      const Icon(Icons.error_outline, color: Colors.redAccent, size: 20),
                                      const SizedBox(width: 8),
                                      Expanded(child: Text(errorMessage, style: const TextStyle(color: Colors.redAccent, fontSize: 13, fontWeight: FontWeight.bold))),
                                    ],
                                  ),
                                ),
                              step == 1
                                  ? _buildWithdrawStep1(context, operator, (val) => setState(() => operator = val), isDark, borderColor)
                                  : step == 2
                                      ? _buildWithdrawStep2(context, operator, nameController, phoneController, amountController, maxAmount, isDark, borderColor, () => setState(() {}))
                                      : _buildWithdrawStep3(context, amountController.text, operator, isDark),
                            ],
                          ),
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
                                             (step == 2 && amountController.text.isEmpty) || 
                                             isLoading
                                      ? null
                                      : () async {
                                          if (step == 1) {
                                            setState(() => step = 2);
                                          } else if (step == 2) {
                                            await submitWithdrawal();
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
                                            Text(step == 1 ? 'Suivant' : 'Confirmer le retrait', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
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

Widget _buildWithdrawStep1(BuildContext context, String? selectedOperator, Function(String) onSelect, bool isDark, Color borderColor) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Choisissez l\'opérateur de réception', style: TextStyle(color: isDark ? Colors.white : const Color(0xFF0F172A), fontSize: 18, fontWeight: FontWeight.bold)),
      const SizedBox(height: 20),
      Row(
        children: [
          Expanded(
            child: _buildWithdrawOperatorCard('wave', selectedOperator, onSelect, isDark, borderColor),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: _buildWithdrawOperatorCard('orange', selectedOperator, onSelect, isDark, borderColor),
          ),
        ],
      ),
    ],
  );
}

Widget _buildWithdrawOperatorCard(String op, String? selectedOperator, Function(String) onSelect, bool isDark, Color borderColor) {
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

Widget _buildWithdrawStep2(BuildContext context, String? operator, TextEditingController nameCtrl, TextEditingController phoneCtrl, TextEditingController amountCtrl, int maxAmount, bool isDark, Color borderColor, VoidCallback onInputChanged) {
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
                Text('Retrait via', style: TextStyle(color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B), fontSize: 14)),
                Text(isWave ? 'Wave Mobile Money' : 'Orange Money', style: TextStyle(color: isDark ? Colors.white : const Color(0xFF0F172A), fontWeight: FontWeight.bold, fontSize: 16)),
              ],
            )
          ],
        ),
      ),
      const SizedBox(height: 24),
      _buildWithdrawalInput(context, 'Nom Complet (bénéficiaire)', Icons.person, '', controller: nameCtrl, isDark: isDark, borderColor: borderColor, inputBg: isDark ? const Color(0xFF141414) : const Color(0xFFF1F5F9), readOnly: true),
      const SizedBox(height: 16),
      _buildWithdrawalInput(context, 'Numéro de Téléphone', Icons.phone, '', isNumber: true, controller: phoneCtrl, isDark: isDark, borderColor: borderColor, inputBg: isDark ? const Color(0xFF141414) : const Color(0xFFF1F5F9), readOnly: true),
      const SizedBox(height: 16),
      _buildWithdrawalInput(context, 'Montant à Retirer (FCFA)', Icons.credit_card, 'Ex: 10000', isNumber: true, isLarge: true, controller: amountCtrl, isDark: isDark, borderColor: borderColor, inputBg: inputBg, onChanged: (_) => onInputChanged()),
    ],
  );
}

Widget _buildWithdrawStep3(BuildContext context, String amount, String? operator, bool isDark) {
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
        Text('Transfert Initié !', style: TextStyle(color: isDark ? Colors.white : const Color(0xFF0F172A), fontSize: 24, fontWeight: FontWeight.w900)),
        const SizedBox(height: 8),
        Text(
          'Votre demande de retrait de $amount FCFA a été envoyée avec succès vers votre compte ${operator == 'wave' ? 'Wave' : 'Orange Money'}.', 
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
          child: const Text('Fermer', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        ),
      ],
    ),
  );
}

Widget _buildWithdrawalInput(BuildContext context, String label, IconData icon, String hint, {TextEditingController? controller, bool isNumber = false, bool isLarge = false, required bool isDark, required Color borderColor, required Color inputBg, bool readOnly = false, void Function(String)? onChanged}) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(label, style: TextStyle(color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF334155), fontSize: 14, fontWeight: FontWeight.bold)),
      const SizedBox(height: 8),
      TextField(
        controller: controller,
        onChanged: onChanged,
        readOnly: readOnly,
        keyboardType: isNumber ? TextInputType.number : TextInputType.text,
        style: TextStyle(
          color: readOnly ? (isDark ? Colors.white54 : Colors.black54) : (isDark ? Colors.white : const Color(0xFF0F172A)), 
          fontSize: isLarge ? 18 : 16, 
          fontWeight: isLarge ? FontWeight.w900 : FontWeight.w500
        ),
        decoration: InputDecoration(
          filled: true,
          fillColor: inputBg,
          prefixIcon: Icon(icon, color: const Color(0xFF94A3B8)),
          hintText: hint,
          hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontWeight: FontWeight.normal),
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
            borderSide: readOnly ? BorderSide(color: borderColor) : const BorderSide(color: Color(0xFF64748B)),
          ),
          contentPadding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
    ],
  );
}
