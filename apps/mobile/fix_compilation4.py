import re

file_path = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart'
with open(file_path, 'r') as f:
    content = f.read()

# Use re.DOTALL to match across newlines, but we have to be careful not to match too greedily.
# Let's just find `const Padding` and replace it with `Padding` if it contains `Theme.of(context)` before the matching closing parenthesis.
# It's safer to just do a simple replace on the exact text.

old_text1 = """                  const Padding(
                    padding: EdgeInsets.only(bottom: 12),
                    child: Text('Choix du véhicule Allo Dakar', style: TextStyle(color: (Theme.of(context).brightness == Brightness.dark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)), fontSize: 14, fontWeight: FontWeight.bold)),
                  ),"""
new_text1 = """                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Text('Choix du véhicule Allo Dakar', style: TextStyle(color: (Theme.of(context).brightness == Brightness.dark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)), fontSize: 14, fontWeight: FontWeight.bold)),
                  ),"""

old_text2 = """                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 20),
                        child: Text("Aucun trajet trouvé pour cette date.", style: TextStyle(color: (Theme.of(context).brightness == Brightness.dark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)))),
                      )"""
new_text2 = """                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        child: Text("Aucun trajet trouvé pour cette date.", style: TextStyle(color: (Theme.of(context).brightness == Brightness.dark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)))),
                      )"""

content = content.replace(old_text1, new_text1)
content = content.replace(old_text2, new_text2)

with open(file_path, 'w') as f:
    f.write(content)
