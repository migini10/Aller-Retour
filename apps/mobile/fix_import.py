import os

with open('/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/home_screen.dart', 'r') as f:
    content = f.read()

if "import 'dart:io';" not in content:
    content = "import 'dart:io';\n" + content

with open('/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/home_screen.dart', 'w') as f:
    f.write(content)
