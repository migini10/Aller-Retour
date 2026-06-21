import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'widgets/recharge_modal.dart';
import '../../widgets/shared_scaffold.dart';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  int? _walletBalance;
  List<dynamic> _transactions = [];

  @override
  void initState() {
    super.initState();
    _fetchWalletBalance();
  }

  Future<void> _fetchWalletBalance() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) return;
      final apiUrl = dotenv.env['API_URL'] ?? 'http://10.0.2.2:3333';
      final response = await http.get(
        Uri.parse('$apiUrl/v1/wallets/my-balance'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (mounted) {
          setState(() {
            _walletBalance = data['balance'] is num ? (data['balance'] as num).toInt() : int.tryParse(data['balance'].toString());
          });
        }
      }
      final responseTx = await http.get(
        Uri.parse('$apiUrl/v1/wallets/my-transactions'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (responseTx.statusCode == 200) {
        final dataTx = json.decode(responseTx.body);
        if (mounted) {
          setState(() {
            _transactions = dataTx;
          });
        }
      }
    } catch (e) {
      debugPrint('Erreur solde wallet: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return SharedScaffold(
      title: 'Mon Wallet',
      subtitle: 'Gérez vos fonds et vos paiements en toute sécurité.',
      icon: Icons.account_balance_wallet,
      iconColor: Colors.blueAccent,
      onRefresh: _fetchWalletBalance,
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Recharger Button at Top
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  showRechargeModal(context);
                },
                icon: Icon(Icons.add, color: Theme.of(context).colorScheme.onSurface),
                label: const Text('Recharger le compte'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB), // blue-600
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
                  colors: [Color(0xFF2563EB), Color(0xFF4338CA)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: const Color(0xFF1E3A8A).withValues(alpha: 0.2), blurRadius: 15, offset: const Offset(0, 5)),
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
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.auto_awesome, color: const Color(0xFFBFDBFE), size: 14),
                            const SizedBox(width: 6),
                            Text('COMPTE PRINCIPAL', style: const TextStyle(color: Color(0xFFEFF6FF), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                          ],
                        ),
                      ),
                      Icon(Icons.account_balance_wallet, color: const Color(0xFFBFDBFE).withValues(alpha: 0.8)),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text('Solde disponible', style: const TextStyle(color: Color(0xFFDBEAFE), fontSize: 14)),
                  const SizedBox(height: 4),
                  RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: _walletBalance != null 
                              ? '${_walletBalance.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]} ')} ' 
                              : '--- ', 
                          style: const TextStyle(color: Colors.white, fontSize: 40, fontWeight: FontWeight.w900)
                        ),
                        TextSpan(text: 'FCFA', style: const TextStyle(color: Color(0xFFBFDBFE), fontSize: 20, fontWeight: FontWeight.bold)),
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
                      icon: const Icon(Icons.call_made, color: Color(0xFF2563EB)),
                      label: const Text('Envoyer du solde', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF2563EB))),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFF2563EB),
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
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.analytics_outlined, color: Theme.of(context).colorScheme.onSurfaceVariant, size: 20),
                      const SizedBox(width: 8),
                      Text('Statistiques du mois', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 16, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  
                  // Dépenses Progress
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Dépenses', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14)),
                      Text('12 500 FCFA', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Stack(
                    children: [
                      Container(height: 8, width: double.infinity, decoration: BoxDecoration(color: Theme.of(context).dividerColor.withValues(alpha: 0.5), borderRadius: BorderRadius.circular(4))),
                      Container(height: 8, width: 140, decoration: BoxDecoration(color: Colors.amber, borderRadius: BorderRadius.circular(4))),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Recharges Progress
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Recharges', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14)),
                      Text('25 000 FCFA', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Stack(
                    children: [
                      Container(height: 8, width: double.infinity, decoration: BoxDecoration(color: Theme.of(context).dividerColor.withValues(alpha: 0.5), borderRadius: BorderRadius.circular(4))),
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
                Expanded(
                  child: Text(
                    'Dernières Transactions', 
                    style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
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
            
            // Transactions List
            if (_transactions.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 20),
                child: Text('Aucune transaction pour le moment.', style: TextStyle(color: Colors.grey, fontStyle: FontStyle.italic)),
              )
            else
              ..._transactions.map((tx) {
                final isPositive = tx['type'] == 'DEPOSIT' || tx['type'] == 'REFUND';
                final amount = (tx['amount'] as num).toInt();
                final String title = tx['type'] == 'DEPOSIT' ? 'Rechargement Wallet' : tx['type'] == 'TICKET_PURCHASE' ? 'Achat de Billet' : tx['type'] == 'TRANSFER' ? 'Transfert' : 'Transaction';
                // Very basic date parsing for flutter
                final dateStr = tx['createdAt'].toString().substring(0, 10);
                return _buildTransactionItem(
                  context: context,
                  icon: isPositive ? Icons.arrow_downward : Icons.arrow_upward,
                  iconColor: isPositive ? Colors.greenAccent : Colors.orangeAccent,
                  title: title,
                  date: dateStr,
                  ref: 'Réf: ${tx['id'].toString().substring(0, 8).toUpperCase()}',
                  amount: '${isPositive ? '+' : '-'} $amount FCFA',
                  amountColor: isPositive ? Colors.greenAccent : Theme.of(context).colorScheme.onSurface,
                  status: tx['status'],
                  statusColor: tx['status'] == 'COMPLETED' ? Colors.greenAccent : (tx['status'] == 'ESCROW' ? Colors.orangeAccent : Colors.grey),
                );
              }),
            
            
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/transactions');
                },
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24), style: BorderStyle.solid),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: Text('Voir tout l\'historique', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }


  Widget _buildTransactionItem({
    required BuildContext context,
    required IconData icon,
    required Color iconColor,
    required String title,
    required String date,
    required String ref,
    required String amount,
    required Color amountColor,
    required String status,
    required Color statusColor,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Theme.of(context).dividerColor),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: iconColor, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(date, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
                const SizedBox(height: 4),
                Text(ref, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Text(amount, style: TextStyle(color: amountColor, fontWeight: FontWeight.w900, fontSize: 16)),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: statusColor.withValues(alpha: 0.3)),
                      ),
                      child: Text(status.toUpperCase(), style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
