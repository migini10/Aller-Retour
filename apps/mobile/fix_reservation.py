import re

with open('/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if 'void _showReservationBottomSheet' in line:
        start_idx = i
    if start_idx != -1 and 'Widget _buildBookingInput' in line:
        end_idx = i - 1
        break

if start_idx != -1 and end_idx != -1:
    modal_code = "".join(lines[start_idx:end_idx])
    
    # Let's replace the hardcoded dark mode colors with Theme-aware or explicit Next.js colors.
    # The Next.js container is white or #000000 (we'll use Theme.of(context).brightness)
    
    # But wait, we need to inject `final isDark = Theme.of(context).brightness == Brightness.dark;`
    # inside `builder: (context) {`
    
    modal_code = modal_code.replace("builder: (context) {", "builder: (context) {\n        final isDark = Theme.of(context).brightness == Brightness.dark;\n        final bgColor = isDark ? const Color(0xFF000000) : Colors.white;\n        final headerBgColor = isDark ? const Color(0xFF0A0A0A) : Colors.slate.shade50;\n        final borderColor = isDark ? const Color(0xFF2A2A2A) : Colors.slate.shade200;\n        final textColor = isDark ? Colors.white : Colors.slate.shade900;\n        final textMutedColor = isDark ? Colors.slate.shade400 : Colors.slate.shade500;")

    # Dialog background
    modal_code = modal_code.replace("color: Theme.of(context).cardColor, // Web dark mode bg", "color: bgColor,")
    # Header background
    modal_code = modal_code.replace("color: Theme.of(context).cardColor, // Header bg", "color: headerBgColor,")
    # Borders
    modal_code = modal_code.replace("BorderSide(color: Theme.of(context).dividerColor)", "BorderSide(color: borderColor)")
    modal_code = modal_code.replace("color: Theme.of(context).dividerColor", "color: borderColor")
    
    # Text colors
    modal_code = modal_code.replace("color: Colors.white70", "color: textMutedColor")
    modal_code = modal_code.replace("color: Colors.white", "color: textColor")
    
    # Other backgrounds
    modal_code = modal_code.replace("color: Theme.of(context).cardColor", "color: isDark ? const Color(0xFF1A1A1A) : Colors.slate.shade50")
    
    # Replace the Dialog container shadow
    modal_code = modal_code.replace("BoxShadow(color: Colors.black.withValues(alpha: 0.5), blurRadius: 24, spreadRadius: 8)", "BoxShadow(color: Colors.black.withValues(alpha: 0.2), blurRadius: 24, spreadRadius: 0)")
    
    # Barrier color
    modal_code = modal_code.replace("barrierColor: Colors.black.withValues(alpha: 0.4)", "barrierColor: Colors.black.withValues(alpha: 0.8)")
    
    # The progress bar uses Theme.of(context).cardColor for background.
    modal_code = modal_code.replace("color: isDark ? const Color(0xFF1A1A1A) : Colors.slate.shade50,\n                        alignment: Alignment.centerLeft,", "color: borderColor,\n                        alignment: Alignment.centerLeft,")

    lines[start_idx:end_idx] = [modal_code]
    
    with open('/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart', 'w') as f:
        f.writelines(lines)
    print("Replaced successfully!")
else:
    print("Could not find boundaries")
