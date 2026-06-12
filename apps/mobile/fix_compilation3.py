import re

file_path = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart'
with open(file_path, 'r') as f:
    content = f.read()

# Replace textColor54 with inline theme check
inline_text_color_54 = "(Theme.of(context).brightness == Brightness.dark ? Colors.white54 : Colors.black54)"
# But wait, inside _showReservationBottomSheet I defined it, so I can keep it there, or just replace ALL of them to be safe.
content = content.replace('textColor54', inline_text_color_54)

# Replace textMutedColor with inline theme check (only the usages, not the definition)
inline_text_muted = "(Theme.of(context).brightness == Brightness.dark ? const Color(0xFF94A3B8) : const Color(0xFF64748B))"
# We should avoid replacing the definition: `final textMutedColor = ...`
content = re.sub(r'(?<!final )textMutedColor', inline_text_muted, content)

# Remove const before Text and others where we just inserted Theme.of(context)
content = re.sub(r'const\s+Text\((.*?Theme\.of\(context\).*?)\)', r'Text(\1)', content)
content = re.sub(r'const\s+Row\((.*?Theme\.of\(context\).*?)\)', r'Row(\1)', content)
content = re.sub(r'const\s+Column\((.*?Theme\.of\(context\).*?)\)', r'Column(\1)', content)
content = re.sub(r'const\s+SizedBox\((.*?Theme\.of\(context\).*?)\)', r'SizedBox(\1)', content)
content = re.sub(r'const\s+Icon\((.*?Theme\.of\(context\).*?)\)', r'Icon(\1)', content)
content = re.sub(r'const\s+Flexible\((.*?Theme\.of\(context\).*?)\)', r'Flexible(\1)', content)
content = re.sub(r'const\s+Padding\((.*?Theme\.of\(context\).*?)\)', r'Padding(\1)', content)
content = re.sub(r'const\s+Center\((.*?Theme\.of\(context\).*?)\)', r'Center(\1)', content)

# There is also an error with `textColor`: "child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.download, size: 16, color: textColor)..."
# So let's replace textColor with inline theme check too, everywhere except definition.
inline_text_color = "(Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF0F172A))"
content = re.sub(r'(?<!final )textColor', inline_text_color, content)

# Run regex again to catch `Theme.of(context)` introduced by textColor
content = re.sub(r'const\s+Text\((.*?Theme\.of\(context\).*?)\)', r'Text(\1)', content)
content = re.sub(r'const\s+Row\((.*?Theme\.of\(context\).*?)\)', r'Row(\1)', content)
content = re.sub(r'const\s+Column\((.*?Theme\.of\(context\).*?)\)', r'Column(\1)', content)
content = re.sub(r'const\s+SizedBox\((.*?Theme\.of\(context\).*?)\)', r'SizedBox(\1)', content)
content = re.sub(r'const\s+Icon\((.*?Theme\.of\(context\).*?)\)', r'Icon(\1)', content)
content = re.sub(r'const\s+Flexible\((.*?Theme\.of\(context\).*?)\)', r'Flexible(\1)', content)
content = re.sub(r'const\s+Padding\((.*?Theme\.of\(context\).*?)\)', r'Padding(\1)', content)
content = re.sub(r'const\s+Center\((.*?Theme\.of\(context\).*?)\)', r'Center(\1)', content)

# Check for const TextStyle with Theme.of(context)
content = re.sub(r'const\s+TextStyle\((.*?Theme\.of\(context\).*?)\)', r'TextStyle(\1)', content)

# There is a line `Text('Demande en attente : ${selectedTrip?['company'] ?? 'Allo Dakar Partenaire'}', style: const TextStyle(color: textColor54, fontSize: 12))`
# My regex above might miss `const TextStyle` inside `Text`. I handled it with the TextStyle regex just now.

with open(file_path, 'w') as f:
    f.write(content)
