import os

file_path = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Fix Continuer button auto-activation
content = content.replace(
    "onChanged: (v) => nom = v,",
    "onChanged: (v) => setState(() => nom = v),"
)
content = content.replace(
    "onChanged: (v) => telephone = v,",
    "onChanged: (v) => setState(() => telephone = v),"
)

# 2. Fix Continuer button logic & disable colors
old_button_start = """                            onPressed: () async {
                              if (step == 1) {"""

new_button_start = """                            onPressed: (step == 3 && (nom.isEmpty || telephone.isEmpty)) ? null : () async {
                              if (step == 1) {"""
content = content.replace(old_button_start, new_button_start)

# 3. Fix "Un proche" container
content = content.replace(
    "color: Colors.black,\n                      border: Border.all(color: borderColor),",
    "color: isDark ? const Color(0xFF141414) : Colors.white,\n                      border: Border.all(color: borderColor),"
)
content = content.replace(
    "Icon(ticketPour == 'moi' ? Icons.person : Icons.group, color: textColor, size: 20)",
    "Icon(ticketPour == 'moi' ? Icons.person : Icons.group, color: Colors.white, size: 20)"
)

# 4. Fix Ticket Background & Text Colors
# Replace `color: textColor` with `color: const Color(0xFF0F172A)` for the ticket container
old_ticket_bg = """                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: textColor,
                        borderRadius: BorderRadius.circular(16),"""
new_ticket_bg = """                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(16),"""
content = content.replace(old_ticket_bg, new_ticket_bg)

# Replace Colors.black with Colors.white inside the ticket (up to QR Code)
old_ticket_body = """                        // Body ticket
                        Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            children: [
                              // Trajet
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('DÉPART', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text(departCity.split(',')[0], style: TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.w900)),
                                        Text('Sénégal', style: TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.w900)),
                                      ],
                                    ),
                                  ),
                                  Icon(Icons.arrow_forward, color: Color(0xFFF97316)),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.end,
                                      children: [
                                        Text('ARRIVÉE', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text(arriveeCity.split(',')[0], style: TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.w900)),
                                        Text('Sénégal', style: TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.w900)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              
                              Padding(
                                padding: EdgeInsets.symmetric(vertical: 16),
                                child: Text('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', style: TextStyle(color: Color(0xFFE2E8F0)), maxLines: 1, overflow: TextOverflow.clip),
                              ),
                              
                              // Infos 1
                              Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('PASSAGER', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text(nom, style: TextStyle(color: Colors.black, fontSize: 14, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('PLACES', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text('$passagersCount', style: TextStyle(color: Color(0xFFEA580C), fontSize: 16, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              
                              SizedBox(height: 16),
                              
                              // Infos 2
                              Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('DATE & HEURE', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text('$dateStr à\\nFlexible', style: TextStyle(color: Colors.black, fontSize: 14, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('PRIX TOTAL', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text('$total FCFA', style: TextStyle(color: Colors.black, fontSize: 14, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              
                              Padding(
                                padding: EdgeInsets.symmetric(vertical: 16),
                                child: Text('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', style: TextStyle(color: Color(0xFFE2E8F0)), maxLines: 1, overflow: TextOverflow.clip),
                              ),"""

new_ticket_body = old_ticket_body.replace("color: Colors.black", "color: Colors.white")
content = content.replace(old_ticket_body, new_ticket_body)

# 5. Fix QR Code background color
old_qr = """                              // QR Code
                              Container(
                                padding: EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: textColor,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(color: Color(0xFFFFF7ED), width: 4),
                                ),"""

new_qr = """                              // QR Code
                              Container(
                                padding: EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(color: Colors.white, width: 4),
                                ),"""
content = content.replace(old_qr, new_qr)

# Fix Continuer button disabled color
old_btn_style = """                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF97316),
                              padding: const EdgeInsets.symmetric(vertical: 18),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              elevation: 8,
                              shadowColor: const Color(0xFFF97316).withValues(alpha: 0.5),
                            ),"""

new_btn_style = """                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF97316),
                              disabledBackgroundColor: isDark ? const Color(0xFF222222) : const Color(0xFFCBD5E1),
                              disabledForegroundColor: isDark ? Colors.white54 : Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 18),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              elevation: 8,
                              shadowColor: const Color(0xFFF97316).withValues(alpha: 0.5),
                            ),"""
content = content.replace(old_btn_style, new_btn_style)

# Also fix the text color in the ticket header: `Text('Aller', style: TextStyle(color: textColor`
content = content.replace("Text('Aller', style: TextStyle(color: textColor", "Text('Aller', style: TextStyle(color: Colors.white")

with open(file_path, 'w') as f:
    f.write(content)
