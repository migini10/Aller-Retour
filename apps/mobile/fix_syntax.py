import os

files_to_fix = [
    '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/widgets/recharge_modal.dart',
    '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart'
]

for file_path in files_to_fix:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Fix the substring replacement bug
    content = content.replace('const Color(0xFFF8FAFC)0', 'const Color(0xFF64748B)')
    
    # Fix Colors.emerald
    content = content.replace('Colors.emerald', 'const Color(0xFF10B981)')

    with open(file_path, 'w') as f:
        f.write(content)
