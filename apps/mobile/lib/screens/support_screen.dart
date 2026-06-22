import 'package:flutter/material.dart';

class SupportScreen extends StatefulWidget {
  const SupportScreen({Key? key}) : super(key: key);

  @override
  State<SupportScreen> createState() => _SupportScreenState();
}

class _SupportScreenState extends State<SupportScreen> {
  final List<Map<String, dynamic>> _faqs = [
    {
      'category': 'Réservations & Trajets',
      'questions': [
        {
          'q': 'Comment annuler une réservation ?',
          'a': 'Vous pouvez annuler votre réservation gratuitement jusqu\'à 24h avant le départ depuis votre tableau de bord, section "Historique". Passé ce délai, des frais d\'annulation peuvent s\'appliquer.',
          'isOpen': false,
        },
        {
          'q': 'Le chauffeur peut-il venir me chercher à domicile ?',
          'a': 'Oui, lors de votre réservation, vous pouvez préciser une adresse de prise en charge. Si celle-ci est dans la zone couverte, le chauffeur viendra vous récupérer directement.',
          'isOpen': false,
        },
        {
          'q': 'Quels sont les modes de paiement acceptés ?',
          'a': 'Nous acceptons les paiements via Wave, Orange Money, et directement depuis votre Wallet Allogoo.',
          'isOpen': false,
        }
      ]
    },
    {
      'category': 'Colis & Livraisons',
      'questions': [
        {
          'q': 'Comment suivre mon colis ?',
          'a': 'Dès que votre colis est pris en charge, vous recevez un code de suivi. Entrez ce code dans la section "Colis" de votre application pour voir sa position en temps réel.',
          'isOpen': false,
        },
        {
          'q': 'Que faire si mon colis est endommagé ?',
          'a': 'Toutes nos livraisons sont couvertes par une assurance de base. En cas de dommage, prenez une photo du colis à réception et contactez immédiatement notre service client.',
          'isOpen': false,
        }
      ]
    }
  ];

  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: const Text('Centre d\'Aide & Support', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Search
              Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  decoration: InputDecoration(
                    hintText: 'Rechercher (ex: annulation, colis...)',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: Colors.transparent,
                  ),
                ),
              ),
              const SizedBox(height: 30),

              // FAQ Categories
              ..._faqs.map((category) {
                final filteredQuestions = (category['questions'] as List).where((q) {
                  return q['q'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) || 
                         q['a'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
                }).toList();

                if (filteredQuestions.isEmpty) return const SizedBox.shrink();

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      child: Text(
                        category['category'],
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.orange,
                        ),
                      ),
                    ),
                    ...filteredQuestions.map((q) => _buildFaqItem(q)),
                  ],
                );
              }).toList(),

              const SizedBox(height: 40),
              
              // Contact Assistance Card
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 15,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    const Text(
                      'Vous n\'avez pas trouvé votre réponse ?',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Notre équipe d\'assistance est disponible 7j/7 pour vous accompagner.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white.withOpacity(0.8),
                      ),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pushNamed(context, '/contact');
                      },
                      icon: const Icon(Icons.message),
                      label: const Text('Nous écrire', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange,
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                    const SizedBox(height: 12),
                    OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.phone),
                      label: const Text('Appeler le support', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: BorderSide(color: Colors.white.withOpacity(0.5)),
                        minimumSize: const Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFaqItem(Map<String, dynamic> q) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 0,
      color: Theme.of(context).colorScheme.surface,
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          title: Text(
            q['q'],
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
          ),
          iconColor: Colors.orange,
          collapsedIconColor: Colors.grey,
          childrenPadding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
          children: [
            Text(
              q['a'],
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
