import 'package:flutter/material.dart';

class DriverRevenusScreen extends StatefulWidget {
  const DriverRevenusScreen({super.key});

  @override
  State<DriverRevenusScreen> createState() => _DriverRevenusScreenState();
}

class _DriverRevenusScreenState extends State<DriverRevenusScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Mes Revenus', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Colors.greenAccent, Colors.teal],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Solde Total', style: TextStyle(color: Colors.black54, fontSize: 16, fontWeight: FontWeight.bold)),
                  SizedBox(height: 8),
                  Text('145 000 FCFA', style: TextStyle(color: Colors.black, fontSize: 36, fontWeight: FontWeight.w900)),
                ],
              ),
            ),
            const SizedBox(height: 32),
            Text('Historique des gains', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 5,
              itemBuilder: (context, index) {
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    backgroundColor: Colors.greenAccent.withValues(alpha: 0.2),
                    child: const Icon(Icons.attach_money, color: Colors.greenAccent),
                  ),
                  title: Text('Course Dakar → Touba', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)),
                  subtitle: Text('Aujourd\'hui, 14:30', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
                  trailing: const Text('+ 45 000 FCFA', style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 16)),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
