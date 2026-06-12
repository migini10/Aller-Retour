import re

# Fix duplicated onChanged
recharge_file = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/widgets/recharge_modal.dart'
with open(recharge_file, 'r') as f:
    content = f.read()

content = re.sub(r'(onChanged: onChanged,\s*)+keyboardType:', r'onChanged: onChanged,\n        keyboardType:', content)

with open(recharge_file, 'w') as f:
    f.write(content)

# Fix const errors
dashboard_file = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart'
with open(dashboard_file, 'r') as f:
    content = f.read()

# Replace `const Text` with `Text` when followed by `textColor`, `textMutedColor`, etc.
content = re.sub(r'const\s+Text\((.*?textColor.*?)\)', r'Text(\1)', content)
content = re.sub(r'const\s+Row\((.*?textColor.*?)\)', r'Row(\1)', content)
content = re.sub(r'const\s+SizedBox\((.*?textColor.*?)\)', r'SizedBox(\1)', content)
content = re.sub(r'const\s+Icon\((.*?textColor.*?)\)', r'Icon(\1)', content)
content = re.sub(r'const\s+Icon\((.*?textMutedColor.*?)\)', r'Icon(\1)', content)

# There is a 'const TextStyle(color: textColor54' inside Text
content = re.sub(r'const\s+TextStyle\((.*?(?:textColor|textMutedColor).*?)\)', r'TextStyle(\1)', content)

with open(dashboard_file, 'w') as f:
    f.write(content)
