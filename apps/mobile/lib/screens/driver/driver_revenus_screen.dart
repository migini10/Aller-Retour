import 'package:flutter/material.dart';
import '../../widgets/shared_scaffold.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'widgets/withdrawal_modal.dart';

class DriverRevenusScreen extends StatefulWidget {
  const DriverRevenusScreen({super.key});

  @override
  State<DriverRevenusScreen> createState() => _DriverRevenusScreenState();
}

class _DriverRevenusScreenState extends State<DriverRevenusScreen> {
  int? _walletBalance;
  List<dynamic> _transactions = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchDriverFinanceData();
  }

  Future<void> _fetchDriverFinanceData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) return;
      final apiUrl = dotenv.env['API_URL'] ?? 'http://10.0.2.2:3333';

      final response = await http.get(
        Uri.parse('$apiUrl/v1/wallets/driver-balance'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (mounted) {
          setState(() {
            _walletBalance = data['balance'] is num 
                ? (data['balance'] as num).toInt() 
                : int.tryParse(data['balance'].toString());
          });
        }
      }

      final responseTx = await http.get(
        Uri.parse('$apiUrl/v1/wallets/driver-transactions'),
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
      debugPrint('Erreur solde wallet chauffeur: $e');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Calculate today's earnings dynamically
    final now = DateTime.now();
    final todayStr = now.toLocal().toString().split(' ').first;
    final oneWeekAgo = now.subtract(const Duration(days: 7));
    
    int todayEarnings = 0;
    int weekEarnings = 0;

    for (var tx in _transactions) {
      final txDateTime = DateTime.parse(tx['createdAt']).toLocal();
      final txDateStr = txDateTime.toString().split(' ').first;
      final amount = (tx['amount'] as num).toInt();

      if (amount > 0) {
        if (txDateStr == todayStr) {
          todayEarnings += amount;
        }
        if (txDateTime.isAfter(oneWeekAgo) && txDateTime.isBefore(now)) {
          weekEarnings += amount;
        }
      }
    }

    return SharedScaffold(
      title: 'Revenus & Wallet',
      subtitle: 'Gérez vos gains de transport.',
      icon: Icons.account_balance_wallet,
      iconColor: Colors.tealAccent,
      isDriverMode: true,
      onRefresh: _fetchDriverFinanceData,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFF97316), Color(0xFFF59E0B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFF97316).withValues(alpha: 0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  )
                ]
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Solde Total Disponible', style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(
                    _walletBalance != null 
                        ? '${_walletBalance.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]} ')} FCFA'
                        : '0 FCFA', 
                    style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900)
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            showWithdrawalModal(context, _walletBalance ?? 0, () {
                              _fetchDriverFinanceData();
                            });
                          },
                          icon: const Icon(Icons.call_made, color: Color(0xFFF97316), size: 16),
                          label: const Text('Retrait instantané', style: TextStyle(color: Color(0xFFF97316), fontWeight: FontWeight.bold, fontSize: 12)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 0,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            showWithdrawalModal(context, _walletBalance ?? 0, () {
                              _fetchDriverFinanceData();
                            });
                          },
                          icon: const Icon(Icons.credit_card, color: Colors.white, size: 16),
                          label: const Text('Méthodes', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.white54),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStatMiniCard('Aujourd\'hui', '$todayEarnings F'),
                _buildStatMiniCard('Cette Semaine', '$weekEarnings F'),
              ],
            ),
            const SizedBox(height: 32),
            Text('Historique des gains', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            if (_isLoading)
              const Center(child: CircularProgressIndicator(color: Colors.orangeAccent))
            else if (_transactions.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(32),
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
                ),
                child: Column(
                  children: [
                    Icon(Icons.history, size: 48, color: Theme.of(context).dividerColor),
                    const SizedBox(height: 12),
                    Text("Aucun gain enregistré", style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)),
                  ],
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _transactions.length,
                itemBuilder: (context, index) {
                  final tx = _transactions[index];
                  final txDate = DateTime.parse(tx['createdAt']).toLocal();
                  final dateStr = "${txDate.day}/${txDate.month}/${txDate.year} ${txDate.hour.toString().padLeft(2, '0')}:${txDate.minute.toString().padLeft(2, '0')}";
                  final amount = (tx['amount'] as num).toInt();

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.3)),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      leading: CircleAvatar(
                        backgroundColor: amount > 0 
                            ? Colors.green.withValues(alpha: 0.15) 
                            : Colors.redAccent.withValues(alpha: 0.15),
                        child: Icon(
                          amount > 0 ? Icons.trending_up : Icons.trending_down, 
                          color: amount > 0 ? Colors.green : Colors.redAccent,
                          size: 20
                        ),
                      ),
                      title: Text(
                        tx['description'] ?? (amount > 0 ? 'Crédit reçu' : 'Débit / Retrait'), 
                        style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 14)
                      ),
                      subtitle: Text(dateStr, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                      trailing: Text(
                        '${amount > 0 ? '+' : ''} $amount F', 
                        style: TextStyle(color: amount > 0 ? Colors.green : Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 15)
                      ),
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatMiniCard(String label, String value) {
    return Container(
      width: (MediaQuery.of(context).size.width - 56) / 2,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 11, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text(value, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }
}
