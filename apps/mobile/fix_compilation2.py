import re

file_path = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart'
with open(file_path, 'r') as f:
    content = f.read()

# Define textColor54 if missing in _showReservationBottomSheet
old_builder = "final textMutedColor = isDark ? Colors.slate.shade400 : Colors.slate.shade500;"
new_builder = "final textMutedColor = isDark ? Colors.slate.shade400 : Colors.slate.shade500;\n        final textColor54 = isDark ? Colors.white54 : Colors.black54;"
if new_builder not in content:
    content = content.replace(old_builder, new_builder)

# Replace remaining `const Text` / `const Row` with variables
content = re.sub(r'const\s+Text\((.*?(?:textColor|textMutedColor|textColor54).*?)\)', r'Text(\1)', content)
content = re.sub(r'const\s+Row\((.*?(?:textColor|textMutedColor|textColor54).*?)\)', r'Row(\1)', content)
content = re.sub(r'const\s+Icon\((.*?(?:textColor|textMutedColor|textColor54).*?)\)', r'Icon(\1)', content)
content = re.sub(r'const\s+SizedBox\((.*?(?:textColor|textMutedColor|textColor54).*?)\)', r'SizedBox(\1)', content)

# Check for const Padding etc.
content = re.sub(r'const\s+Padding\((.*?(?:textColor|textMutedColor|textColor54).*?)\)', r'Padding(\1)', content)
content = re.sub(r'const\s+Column\((.*?(?:textColor|textMutedColor|textColor54).*?)\)', r'Column(\1)', content)
content = re.sub(r'const\s+Flexible\((.*?(?:textColor|textMutedColor|textColor54).*?)\)', r'Flexible(\1)', content)

with open(file_path, 'w') as f:
    f.write(content)
