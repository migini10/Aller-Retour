import os

file_path = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/widgets/recharge_modal.dart'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Update call to _buildRechargeStep2
content = content.replace(
    "_buildRechargeStep2(context, operator, nameController, phoneController, amountController, isDark, borderColor)",
    "_buildRechargeStep2(context, operator, nameController, phoneController, amountController, isDark, borderColor, () => setState(() {}))"
)

# 2. Update _buildRechargeStep2 signature
content = content.replace(
    "Widget _buildRechargeStep2(BuildContext context, String? operator, TextEditingController nameCtrl, TextEditingController phoneCtrl, TextEditingController amountCtrl, bool isDark, Color borderColor) {",
    "Widget _buildRechargeStep2(BuildContext context, String? operator, TextEditingController nameCtrl, TextEditingController phoneCtrl, TextEditingController amountCtrl, bool isDark, Color borderColor, VoidCallback onInputChanged) {"
)

# 3. Add onChanged to the 3 _buildWizardInput calls
content = content.replace(
    "controller: nameCtrl, isDark: isDark, borderColor: borderColor, inputBg: inputBg)",
    "controller: nameCtrl, isDark: isDark, borderColor: borderColor, inputBg: inputBg, onChanged: (_) => onInputChanged())"
)
content = content.replace(
    "controller: phoneCtrl, isDark: isDark, borderColor: borderColor, inputBg: inputBg)",
    "controller: phoneCtrl, isDark: isDark, borderColor: borderColor, inputBg: inputBg, onChanged: (_) => onInputChanged())"
)
content = content.replace(
    "controller: amountCtrl, isDark: isDark, borderColor: borderColor, inputBg: inputBg)",
    "controller: amountCtrl, isDark: isDark, borderColor: borderColor, inputBg: inputBg, onChanged: (_) => onInputChanged())"
)

# 4. Update _buildWizardInput signature
content = content.replace(
    "Widget _buildWizardInput(BuildContext context, String label, IconData icon, String hint, {TextEditingController? controller, bool isNumber = false, bool isLarge = false, required bool isDark, required Color borderColor, required Color inputBg}) {",
    "Widget _buildWizardInput(BuildContext context, String label, IconData icon, String hint, {TextEditingController? controller, bool isNumber = false, bool isLarge = false, required bool isDark, required Color borderColor, required Color inputBg, void Function(String)? onChanged}) {"
)

# 5. Add onChanged to TextField
content = content.replace(
    "        keyboardType: isNumber ? TextInputType.number : TextInputType.text,",
    "        onChanged: onChanged,\n        keyboardType: isNumber ? TextInputType.number : TextInputType.text,"
)

with open(file_path, 'w') as f:
    f.write(content)
