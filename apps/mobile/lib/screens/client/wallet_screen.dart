import 'package:flutter/material.dart';

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617), // slate-950
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Row(
          children: [
            Icon(Icons.account_balance_wallet, color: Colors.blueAccent),
            SizedBox(width: 12),
            Text('Mon Wallet', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Recharger Button at Top
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  _showRechargeBottomSheet(context);
                },
                icon: const Icon(Icons.add, color: Colors.white),
                label: const Text('Recharger le compte'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 24),
            
            // Main Balance Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Colors.blueAccent, Colors.indigo],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.blueAccent.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.white.withOpacity(0.3)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.auto_awesome, color: Colors.white, size: 14),
                            SizedBox(width: 6),
                            Text('COMPTE PRINCIPAL', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                          ],
                        ),
                      ),
                      const Icon(Icons.account_balance_wallet, color: Colors.white70),
                    ],
                  ),
                  const SizedBox(height: 24),
                  const Text('Solde disponible', style: TextStyle(color: Colors.white70, fontSize: 14)),
                  const SizedBox(height: 4),
                  RichText(
                    text: const TextSpan(
                      children: [
                        TextSpan(text: '45 000 ', style: TextStyle(color: Colors.white, fontSize: 40, fontWeight: FontWeight.w900)),
                        TextSpan(text: 'FCFA', style: TextStyle(color: Colors.white70, fontSize: 20, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Module d\'envoi...')));
                      },
                      icon: const Icon(Icons.call_made, color: Colors.blueAccent),
                      label: const Text('Envoyer du solde'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.blueAccent,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        textStyle: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Statistiques du mois
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.analytics_outlined, color: Colors.white54, size: 20),
                      SizedBox(width: 8),
                      Text('Statistiques du mois', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  
                  // Dépenses Progress
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Dépenses', style: TextStyle(color: Colors.white54, fontSize: 14)),
                      Text('12 500 FCFA', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Stack(
                    children: [
                      Container(height: 8, width: double.infinity, decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(4))),
                      Container(height: 8, width: 140, decoration: BoxDecoration(color: Colors.amber, borderRadius: BorderRadius.circular(4))),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Recharges Progress
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Recharges', style: TextStyle(color: Colors.white54, fontSize: 14)),
                      Text('25 000 FCFA', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Stack(
                    children: [
                      Container(height: 8, width: double.infinity, decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(4))),
                      Container(height: 8, width: 220, decoration: BoxDecoration(color: Colors.blueAccent, borderRadius: BorderRadius.circular(4))),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            
            // Transactions Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Dernières Transactions', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                TextButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Relevé PDF en préparation...')));
                  },
                  icon: const Icon(Icons.download, size: 16, color: Colors.blueAccent),
                  label: const Text('Relevé PDF', style: TextStyle(color: Colors.blueAccent)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Transaction 1
            _buildTransactionItem(
              icon: Icons.arrow_downward,
              iconColor: Colors.blueAccent,
              title: 'Dépôt Wave Mobile Money',
              date: '17 Mai 2026 • 10:45',
              amount: '+ 15 000 FCFA',
              amountColor: Colors.blueAccent,
              status: 'Complété',
              statusColor: Colors.greenAccent,
            ),
            
            // Transaction 2
            _buildTransactionItem(
              icon: Icons.arrow_upward,
              iconColor: Colors.orangeAccent,
              title: 'Réservation Dakar ➔ Touba',
              date: '15 Mai 2026 • 14:20',
              amount: '- 4 500 FCFA',
              amountColor: Colors.white,
              status: 'En Séquestre',
              statusColor: Colors.orangeAccent,
            ),
            
            // Transaction 3
            _buildTransactionItem(
              icon: Icons.credit_card,
              iconColor: Colors.purpleAccent,
              title: 'Paiement Colis Express',
              date: '12 Mai 2026 • 09:15',
              amount: '- 2 500 FCFA',
              amountColor: Colors.white,
              status: 'Terminé',
              statusColor: Colors.grey,
            ),
            
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Historique...')));
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.white24, style: BorderStyle.solid),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('Voir tout l\'historique', style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String date,
    required String amount,
    required Color amountColor,
    required String status,
    required Color statusColor,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: iconColor, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(date, style: const TextStyle(color: Colors.white54, fontSize: 12)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(amount, style: TextStyle(color: amountColor, fontWeight: FontWeight.w900, fontSize: 16)),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: statusColor.withOpacity(0.3)),
                ),
                child: Text(status.toUpperCase(), style: TextStyle(color: statusColor, fontSize: 9, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showRechargeBottomSheet(BuildContext context) {
    int step = 1;
    String? operator;
    bool isLoading = false;
    final nameController = TextEditingController();
    final phoneController = TextEditingController();
    final amountController = TextEditingController();

    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            return Dialog(
              backgroundColor: Colors.transparent,
              insetPadding: const EdgeInsets.all(16),
              child: Container(
                width: 400, // Reduced from 500
                constraints: BoxConstraints(
                  minHeight: 500, // Added minHeight to increase popup height
                  maxHeight: MediaQuery.of(context).size.height * 0.9,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A1A), // Web dark mode bg
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 24, spreadRadius: 8),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                      decoration: const BoxDecoration(
                        color: Color(0xFF141414), // Header bg
                        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                        border: Border(bottom: BorderSide(color: Color(0xFF2A2A2A))),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                step == 3 ? 'Recharge réussie' : 'Recharger mon Wallet',
                                style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900),
                              ),
                              if (step < 3)
                                Padding(
                                  padding: const EdgeInsets.only(top: 4),
                                  child: Text('Étape $step sur 2', style: const TextStyle(color: Colors.white54, fontSize: 13)),
                                ),
                            ],
                          ),
                          Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFF222222),
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(color: const Color(0xFF333333)),
                            ),
                            child: IconButton(
                              icon: const Icon(Icons.close, color: Colors.white70),
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
                            ? _buildRechargeStep1(operator, (val) => setState(() => operator = val))
                            : step == 2
                                ? _buildRechargeStep2(operator, nameController, phoneController, amountController)
                                : _buildRechargeStep3(context),
                      ),
                    ),

                    // Footer Actions
                    if (step < 3)
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: const BoxDecoration(
                          color: Color(0xFF141414),
                          borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
                          border: Border(top: BorderSide(color: Color(0xFF2A2A2A))),
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
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                    backgroundColor: const Color(0xFF222222),
                                  ),
                                  child: const Text('Retour', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                ),
                              ),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: (step == 1 && operator == null) || isLoading
                                    ? null
                                    : () async {
                                        if (step == 1) {
                                          setState(() => step = 2);
                                        } else if (step == 2) {
                                        setState(() => isLoading = true);
                                        
                                        // PREPARATION DE L'API (À remplacer par les vrais appels backend plus tard)
                                        final paymentData = {
                                          'provider': operator,
                                          'customer': {
                                            'fullName': nameController.text,
                                            'phone': phoneController.text,
                                          },
                                          'amount': int.tryParse(amountController.text) ?? 0,
                                          'currency': 'XOF',
                                          'reference': 'RECHARGE_${DateTime.now().millisecondsSinceEpoch}'
                                        };
                                        
                                        debugPrint("Appel API de paiement préparé avec les données: $paymentData");
                                        
                                        // Simuler l'attente de réponse de l'API
                                        await Future.delayed(const Duration(milliseconds: 1500));
                                        
                                        // Simuler l'URL de redirection retournée par l'API de l'opérateur
                                        final mockPaymentUrl = operator == 'wave' 
                                          ? 'https://pay.wave.com/checkout?amount=${paymentData['amount']}&ref=${paymentData['reference']}'
                                          : 'https://api.orangemoney.com/checkout?amount=${paymentData['amount']}&ref=${paymentData['reference']}';
                                          
                                        debugPrint("Redirection vers l'API: $mockPaymentUrl");
                                        
                                        if (context.mounted) {
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            SnackBar(
                                              content: Text('Redirection vers $operator API simulée avec succès'),
                                              backgroundColor: Colors.green,
                                            ),
                                          );
                                        }

                                        setState(() {
                                          isLoading = false;
                                          step = 3;
                                        });
                                      }
                                      },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: operator == 'wave' ? const Color(0xFF1DA1F2) : operator == 'orange' ? const Color(0xFFFF7900) : Colors.white,
                                  foregroundColor: operator == null ? Colors.black : Colors.white,
                                  disabledBackgroundColor: const Color(0xFF222222),
                                  disabledForegroundColor: Colors.white54,
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                ),
                                child: isLoading
                                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                    : Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Text(step == 1 ? 'Suivant' : 'Confirmer le paiement', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                          const SizedBox(width: 8),
                                          const Icon(Icons.chevron_right),
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
        );
      },
    );
  }

  Widget _buildRechargeStep1(String? selectedOperator, Function(String) onSelect) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Choisissez votre opérateur', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 20),
        Column(
          children: [
            GestureDetector(
              onTap: () => onSelect('wave'),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
                decoration: BoxDecoration(
                  color: selectedOperator == 'wave' ? const Color(0xFF1DA1F2).withOpacity(0.1) : Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: selectedOperator == 'wave' ? const Color(0xFF1DA1F2) : Colors.white10,
                    width: 2,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: const BoxDecoration(
                        color: Color(0xFF1DA1F2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.waves, color: Colors.white, size: 32),
                    ),
                    const SizedBox(width: 16),
                    Text('Wave', style: TextStyle(color: selectedOperator == 'wave' ? const Color(0xFF1DA1F2) : Colors.white70, fontSize: 18, fontWeight: FontWeight.bold)),
                    const Spacer(),
                    if (selectedOperator == 'wave')
                      const Icon(Icons.check_circle, color: Color(0xFF1DA1F2)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            GestureDetector(
              onTap: () => onSelect('orange'),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
                decoration: BoxDecoration(
                  color: selectedOperator == 'orange' ? const Color(0xFFFF7900).withOpacity(0.1) : Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: selectedOperator == 'orange' ? const Color(0xFFFF7900) : Colors.white10,
                    width: 2,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFFF7900).withOpacity(0.3)),
                      ),
                      child: const Icon(Icons.money, color: Color(0xFFFF7900), size: 32),
                    ),
                    const SizedBox(width: 16),
                    Text('Orange Money', style: TextStyle(color: selectedOperator == 'orange' ? const Color(0xFFFF7900) : Colors.white70, fontSize: 18, fontWeight: FontWeight.bold)),
                    const Spacer(),
                    if (selectedOperator == 'orange')
                      const Icon(Icons.check_circle, color: Color(0xFFFF7900)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildRechargeStep2(String? operator, TextEditingController nameCtrl, TextEditingController phoneCtrl, TextEditingController amountCtrl) {
    Color opColor = operator == 'wave' ? const Color(0xFF1DA1F2) : const Color(0xFFFF7900);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white10),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: operator == 'wave' ? opColor : Colors.black,
                  borderRadius: BorderRadius.circular(12),
                  border: operator == 'orange' ? Border.all(color: opColor.withOpacity(0.3)) : null,
                ),
                child: Icon(operator == 'wave' ? Icons.waves : Icons.money, color: operator == 'wave' ? Colors.white : opColor),
              ),
              const SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Recharge via', style: TextStyle(color: Colors.white54, fontSize: 13)),
                  Text(operator == 'wave' ? 'Wave Mobile Money' : 'Orange Money', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                ],
              )
            ],
          ),
        ),
        const SizedBox(height: 24),
        _buildWizardInput('Nom Complet', Icons.person, 'Ex: Abdou Bakhe', controller: nameCtrl),
        const SizedBox(height: 16),
        _buildWizardInput('Numéro de Téléphone', Icons.phone, 'Ex: 77 123 45 67', isNumber: true, controller: phoneCtrl),
        const SizedBox(height: 16),
        _buildWizardInput('Montant à Recharger (FCFA)', Icons.credit_card, 'Ex: 10000', isNumber: true, isLarge: true, controller: amountCtrl),
      ],
    );
  }

  Widget _buildRechargeStep3(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: Colors.greenAccent.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle, color: Colors.greenAccent, size: 60),
          ),
          const SizedBox(height: 24),
          const Text('Demande Envoyée !', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
          const SizedBox(height: 12),
          const Text('Veuillez valider le paiement sur votre téléphone.', textAlign: TextAlign.center, style: TextStyle(color: Colors.white54, fontSize: 16)),
          const SizedBox(height: 40),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('Retour au Wallet', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 16)),
          ),
        ],
      ),
    );
  }

  Widget _buildWizardInput(String label, IconData icon, String hint, {bool isNumber = false, bool isLarge = false, TextEditingController? controller}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          keyboardType: isNumber ? TextInputType.number : TextInputType.text,
          style: TextStyle(color: Colors.white, fontSize: isLarge ? 20 : 16, fontWeight: isLarge ? FontWeight.w900 : FontWeight.w600),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.white.withOpacity(0.05),
            prefixIcon: Icon(icon, color: Colors.white54),
            hintText: hint,
            hintStyle: const TextStyle(color: Colors.white30),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Color(0xFF333333)), // Gray border like Web
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Color(0xFF333333)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Colors.orangeAccent),
            ),
            contentPadding: const EdgeInsets.symmetric(vertical: 20),
          ),
        ),
      ],
    );
  }
}
