import os

files_to_fix = [
    '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/widgets/recharge_modal.dart',
    '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart'
]

replacements = {
    'Colors.slate.shade50': 'const Color(0xFFF8FAFC)',
    'Colors.slate.shade200': 'const Color(0xFFE2E8F0)',
    'Colors.slate.shade300': 'const Color(0xFFCBD5E1)',
    'Colors.slate.shade400': 'const Color(0xFF94A3B8)',
    'Colors.slate.shade500': 'const Color(0xFF64748B)',
    'Colors.slate.shade600': 'const Color(0xFF475569)',
    'Colors.slate.shade700': 'const Color(0xFF334155)',
    'Colors.slate.shade900': 'const Color(0xFF0F172A)',
}

for file_path in files_to_fix:
    with open(file_path, 'r') as f:
        content = f.read()
    
    for k, v in replacements.items():
        content = content.replace(k, v)
        
    # Also fix the _buildBookingInput inputs if I ran the previous script but wait, I didn't write to file in the previous python script!
    # Ah, in fix_inputs.py, I did `code = code.replace...` but I never wrote it back to `f.write()`. So `client_dashboard_screen.dart` bottom inputs are untouched!
    # Let me do it here.
    
    # _buildBookingInput
    content = content.replace("filled: true,\n        fillColor: Colors.black, // bg-black", "filled: true,\n        fillColor: Theme.of(context).brightness == Brightness.dark ? Colors.black : Colors.white,")

    # _buildDropdownInput
    content = content.replace("filled: true,\n          fillColor: Colors.black,", "filled: true,\n          fillColor: Theme.of(context).brightness == Brightness.dark ? Colors.black : Colors.white,")
    
    # _buildPlacesAutocomplete
    content = content.replace("fillColor: Colors.black,", "fillColor: Theme.of(context).brightness == Brightness.dark ? Colors.black : Colors.white,")

    with open(file_path, 'w') as f:
        f.write(content)
