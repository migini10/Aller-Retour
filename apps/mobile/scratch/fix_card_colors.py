import os
import re

def process_wallet():
    path = "/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/wallet_screen.dart"
    with open(path, 'r') as f:
        content = f.read()

    # Button "Recharger le compte"
    content = content.replace("backgroundColor: Colors.blueAccent,", "backgroundColor: const Color(0xFF2563EB), // blue-600")

    # Main Card Gradient
    content = content.replace("colors: [Colors.blueAccent, Colors.indigo]", "colors: [Color(0xFF2563EB), Color(0xFF4338CA)]")
    content = content.replace("color: Colors.blueAccent.withValues(alpha: 0.3)", "color: const Color(0xFF1E3A8A).withValues(alpha: 0.2)") # shadow-blue-900/20

    # Inside the card, all text should be white or shades of white (blue-50, blue-100, blue-200)
    # 1. Sparkles icon and COMPTE PRINCIPAL
    content = re.sub(r"color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\.withValues\(alpha:\s*0\.2\)", "color: Colors.white.withValues(alpha: 0.2)", content)
    content = re.sub(r"border:\s*Border\.all\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\.withValues\(alpha:\s*0\.3\)\)", "border: Border.all(color: Colors.white.withValues(alpha: 0.1))", content)
    content = re.sub(r"Icon\(Icons\.auto_awesome,\s*color:\s*Theme\.of\(context\)\.colorScheme\.onSurface", "Icon(Icons.auto_awesome, color: const Color(0xFFBFDBFE)", content)
    content = re.sub(r"Text\('COMPTE PRINCIPAL',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface", "Text('COMPTE PRINCIPAL', style: const TextStyle(color: Color(0xFFEFF6FF)", content)

    # 2. Wallet Icon
    content = re.sub(r"Icon\(Icons\.account_balance_wallet,\s*color:\s*Theme\.of\(context\)\.colorScheme\.onSurfaceVariant\)", "Icon(Icons.account_balance_wallet, color: const Color(0xFFBFDBFE).withValues(alpha: 0.8))", content)

    # 3. Solde disponible
    content = re.sub(r"Text\('Solde disponible',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurfaceVariant", "Text('Solde disponible', style: const TextStyle(color: Color(0xFFDBEAFE)", content)

    # 4. 45 000 FCFA
    content = re.sub(r"TextSpan\(text:\s*'45 000 ',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface", "TextSpan(text: '45 000 ', style: const TextStyle(color: Colors.white", content)
    content = re.sub(r"TextSpan\(text:\s*'FCFA',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurfaceVariant", "TextSpan(text: 'FCFA', style: const TextStyle(color: Color(0xFFBFDBFE)", content)

    # 5. Envoyer du solde button
    # text is blue-600
    content = re.sub(r"backgroundColor:\s*Colors\.white,\n\s*foregroundColor:\s*Colors\.blueAccent", "backgroundColor: Colors.white,\n                        foregroundColor: const Color(0xFF2563EB)", content)
    content = content.replace("icon: const Icon(Icons.call_made, color: Colors.blueAccent)", "icon: const Icon(Icons.call_made, color: Color(0xFF2563EB))")
    content = content.replace("label: const Text('Envoyer du solde')", "label: const Text('Envoyer du solde', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF2563EB)))")

    with open(path, 'w') as f:
        f.write(content)

def process_fidelite():
    path = "/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/fidelite_screen.dart"
    with open(path, 'r') as f:
        content = f.read()

    # Main Card Gradient
    # Next.js: from-emerald-600 to-teal-800 => 059669 to 115e59
    content = content.replace("colors: [Colors.green, Colors.teal]", "colors: [Color(0xFF059669), Color(0xFF115E59)]")
    
    # "STATUT GOLD" pill
    content = re.sub(r"color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\.withValues\(alpha:\s*0\.2\)", "color: Colors.white.withValues(alpha: 0.2)", content)
    content = re.sub(r"border:\s*Border\.all\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\.withValues\(alpha:\s*0\.3\)\)", "border: Border.all(color: Colors.white.withValues(alpha: 0.1))", content)
    content = re.sub(r"Icon\(Icons\.workspace_premium,\s*color:\s*Theme\.of\(context\)\.colorScheme\.onSurface", "Icon(Icons.workspace_premium, color: const Color(0xFFFDE047)", content)
    content = re.sub(r"Text\('STATUT GOLD',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface", "Text('STATUT GOLD', style: const TextStyle(color: Colors.white", content)
    
    # Award Icon right
    content = re.sub(r"Icon\(Icons\.military_tech,\s*color:\s*Theme\.of\(context\)\.colorScheme\.onSurfaceVariant", "Icon(Icons.military_tech, color: const Color(0xFFA7F3D0).withValues(alpha: 0.8)", content)
    
    # Solde actuel
    content = re.sub(r"Text\('Solde actuel',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurfaceVariant", "Text('Solde actuel', style: const TextStyle(color: Color(0xFFD1FAE5)", content)
    
    # 450 PTS
    content = re.sub(r"TextSpan\(text:\s*'450 ',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface", "TextSpan(text: '450 ', style: const TextStyle(color: Colors.white", content)
    content = re.sub(r"TextSpan\(text:\s*'PTS',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurfaceVariant", "TextSpan(text: 'PTS', style: const TextStyle(color: Color(0xFFA7F3D0)", content)
    
    # Prochain Palier box
    content = re.sub(r"color:\s*Colors\.black\.withValues\(alpha:\s*0\.1\)", "color: Colors.black.withValues(alpha: 0.2)", content)
    content = re.sub(r"border:\s*Border\.all\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\.withValues\(alpha:\s*0\.1\)\)", "border: Border.all(color: Colors.white.withValues(alpha: 0.1))", content)
    
    # "Prochain Palier" text
    content = re.sub(r"Text\('Prochain Palier',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface", "Text('Prochain Palier', style: const TextStyle(color: Color(0xFFD1FAE5)", content)
    content = re.sub(r"Icon\(Icons\.track_changes,\s*color:\s*Theme\.of\(context\)\.colorScheme\.onSurface", "Icon(Icons.track_changes, color: const Color(0xFFD1FAE5)", content)
    content = re.sub(r"Text\('550 PTS',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface", "Text('550 PTS', style: const TextStyle(color: Color(0xFFD1FAE5)", content)
    
    # Progress Bar background
    content = re.sub(r"color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\.withValues\(alpha:\s*0\.2\)", "color: Colors.black.withValues(alpha: 0.3)", content)
    
    # Progress Bar gradient
    content = content.replace("colors: [Colors.greenAccent, Colors.yellowAccent]", "colors: [Color(0xFF34D399), Color(0xFFFDE047)]")
    
    # Plus que 100 PTS
    content = re.sub(r"Text\('Plus que 100 PTS pour un trajet Dakar ➔ Thiès gratuit !',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurfaceVariant", "Text('Plus que 100 PTS pour un trajet Dakar ➔ Thiès gratuit !', style: const TextStyle(color: Color(0xFFA7F3D0)", content)
    
    with open(path, 'w') as f:
        f.write(content)

def process_colis():
    path = "/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/colis_screen.dart"
    with open(path, 'r') as f:
        content = f.read()

    # "Envoyer un colis" header button
    content = content.replace("backgroundColor: Colors.purple,", "backgroundColor: const Color(0xFF9333EA), // purple-600")

    # Card 1: Total
    # Next.js: text-purple-600 dark:text-purple-400
    # Actually wait, the user's screenshot only shows the bottom of the stats row ("11 Colis livrés", "15kg Franchise"). We'll just fix the gradients.

    # Allo Dakar Express Card
    # Next.js: from-orange-500 to-rose-500 => f97316 to f43f5e
    content = content.replace("colors: [Colors.orange, Colors.deepOrangeAccent]", "colors: [Color(0xFFF97316), Color(0xFFF43F5E)]")
    
    # Inside Allo Dakar Express Card
    # "Allo Dakar Express"
    content = re.sub(r"Icon\(Icons\.local_shipping,\s*color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\)", "Icon(Icons.local_shipping, color: Colors.white)", content)
    content = re.sub(r"Text\('Allo Dakar Express',\s*style:\s*TextStyle\(fontSize:\s*20,\s*fontWeight:\s*FontWeight\.w900,\s*color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\)", "Text('Allo Dakar Express', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white))", content)
    
    # Description text
    content = re.sub(r"Text\('Gérez et suivez l\\'expédition de vos colis à travers le pays\.',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurfaceVariant\)", "Text('Gérez et suivez l\\'expédition de vos colis à travers le pays.', style: const TextStyle(color: Color(0xFFFFF7ED)))", content)
    
    # "Envoyer un colis" button
    content = re.sub(r"backgroundColor:\s*Theme\.of\(context\)\.cardColor,\n\s*foregroundColor:\s*Colors\.orange", "backgroundColor: Colors.white,\n                        foregroundColor: const Color(0xFFEA580C)", content)
    content = re.sub(r"Icon\(Icons\.add,\s*color:\s*Colors\.orange\)", "Icon(Icons.add, color: const Color(0xFFEA580C))", content)
    content = re.sub(r"Text\('Envoyer un colis',\s*style:\s*TextStyle\(color:\s*Colors\.orange", "Text('Envoyer un colis', style: const TextStyle(color: Color(0xFFEA580C)", content)

    # Suivre un colis Card
    # Next.js: from-purple-600 to-indigo-900 => 9333ea to 312e81
    content = content.replace("colors: [Colors.deepPurple, Colors.indigo]", "colors: [Color(0xFF9333EA), Color(0xFF312E81)]")
    
    # "Suivre un colis" Title
    content = re.sub(r"Text\('Suivre un colis',\s*style:\s*TextStyle\(fontSize:\s*20,\s*fontWeight:\s*FontWeight\.bold,\s*color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\)", "Text('Suivre un colis', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white))", content)
    
    # Description text
    content = re.sub(r"Text\('Entrez le numéro de suivi pour connaître son statut en temps réel\.',\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurfaceVariant\)", "Text('Entrez le numéro de suivi pour connaître son statut en temps réel.', style: const TextStyle(color: Color(0xFFE9D5FF)))", content)

    # Search Box
    content = re.sub(r"fillColor:\s*Theme\.of\(context\)\.colorScheme\.onSurface\.withValues\(alpha:\s*0\.05\)", "fillColor: Colors.white.withValues(alpha: 0.1)", content)
    content = re.sub(r"borderSide:\s*BorderSide\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\.withValues\(alpha:\s*0\.1\)\)", "borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.2))", content)
    content = re.sub(r"borderSide:\s*BorderSide\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\.withValues\(alpha:\s*0\.3\)\)", "borderSide: const BorderSide(color: Colors.white)", content)
    content = re.sub(r"hintStyle:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurfaceVariant\)", "hintStyle: const TextStyle(color: Color(0xFFD8B4FE))", content)
    content = re.sub(r"prefixIcon:\s*Icon\(Icons\.search,\s*color:\s*Theme\.of\(context\)\.colorScheme\.onSurfaceVariant\)", "prefixIcon: const Icon(Icons.search, color: Color(0xFFD8B4FE))", content)
    
    # Ensure search input text color is white
    content = re.sub(r"TextField\(\n\s*controller:\s*searchController,\n\s*style:\s*TextStyle\(color:\s*Theme\.of\(context\)\.colorScheme\.onSurface\)", "TextField(\n                          controller: searchController,\n                          style: const TextStyle(color: Colors.white)", content)

    # Rechercher Button
    content = re.sub(r"backgroundColor:\s*Theme\.of\(context\)\.cardColor,\n\s*foregroundColor:\s*Colors\.deepPurple", "backgroundColor: Colors.white,\n                          foregroundColor: const Color(0xFF9333EA)", content)
    content = re.sub(r"Text\('Rechercher',\s*style:\s*TextStyle\(color:\s*Colors\.deepPurple", "Text('Rechercher', style: const TextStyle(color: Color(0xFF9333EA)", content)

    with open(path, 'w') as f:
        f.write(content)

process_wallet()
process_fidelite()
process_colis()
print("Done")
