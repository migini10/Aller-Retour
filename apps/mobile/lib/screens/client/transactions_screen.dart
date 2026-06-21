import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../widgets/shared_scaffold.dart';

class TransactionsScreen extends StatefulWidget {
  const TransactionsScreen({super.key});

  @override
  State<TransactionsScreen> createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  List<dynamic> _transactions = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchTransactions();
  }

  Future<void> _fetchTransactions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) {
        setState(() => _isLoading = false);
        return;
      }
      final apiUrl = dotenv.env['API_URL'] ?? 'http://10.0.2.2:3333';
      
      final responseTx = await http.get(
        Uri.parse('$apiUrl/v1/wallets/my-transactions'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (responseTx.statusCode == 200) {
        if (mounted) {
          setState(() {
            _transactions = json.decode(responseTx.body);
            _isLoading = false;
          });
        }
      } else {
        if (mounted) setState(() => _isLoading = false);
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
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

  @override
  Widget build(BuildContext context) {
    return SharedScaffold(
      title: 'Historique des Transactions',
      subtitle: 'Retrouvez toutes les opérations de votre wallet.',
      icon: Icons.receipt_long,
      iconColor: Colors.blueAccent,
      onRefresh: _fetchTransactions,
      body: _isLoading
          ? const Padding(
              padding: EdgeInsets.all(40),
              child: Center(child: CircularProgressIndicator()),
            )
          : Padding(
              padding: const EdgeInsets.all(20),
              child: ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _transactions.isEmpty ? 1 : _transactions.length,
                itemBuilder: (context, index) {
                  if (_transactions.isEmpty) {
                    return const Padding(
                      padding: EdgeInsets.symmetric(vertical: 20),
                      child: Text('Aucune transaction pour le moment.', style: TextStyle(color: Colors.grey, fontStyle: FontStyle.italic)),
                    );
                  }

                  final tx = _transactions[index];
                  final isPositive = tx['type'] == 'DEPOSIT' || tx['type'] == 'REFUND';
                  final amount = (tx['amount'] as num).toInt();
                  final String title = tx['type'] == 'DEPOSIT' ? 'Rechargement Wallet' : tx['type'] == 'TICKET_PURCHASE' ? 'Achat de Billet' : tx['type'] == 'TRANSFER' ? 'Transfert' : 'Transaction';
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
                },
              ),
            ),
    );
  }
}
