import os
import re

TARGET_DIR = "/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client"

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content

    # Replace hardcoded border colors with Theme.of(context).dividerColor
    content = re.sub(r'color:\s*const\s*Color\(0xFF(1E293B|333333|2A2A2A|111111)\)', r'color: Theme.of(context).dividerColor', content)
    content = re.sub(r'color:\s*Color\(0xFF(1E293B|333333|2A2A2A|111111)\)', r'color: Theme.of(context).dividerColor', content)

    # Replace hardcoded backgrounds (like 222222) with Theme.of(context).cardColor
    content = re.sub(r'backgroundColor:\s*const\s*Color\(0xFF(222222|111111)\)', r'backgroundColor: Theme.of(context).cardColor', content)
    content = re.sub(r'backgroundColor:\s*Color\(0xFF(222222|111111)\)', r'backgroundColor: Theme.of(context).cardColor', content)
    
    # Replace other color properties for containers
    content = re.sub(r'color:\s*const\s*Color\(0xFF222222\)', r'color: Theme.of(context).cardColor', content)
    content = re.sub(r'color:\s*Color\(0xFF222222\)', r'color: Theme.of(context).cardColor', content)

    # Also there are some `const BorderSide` that will break if we use Theme.of(context). Remove const.
    content = re.sub(r'const\s+BorderSide\(\s*color:\s*Theme\.of\(context\)', r'BorderSide(color: Theme.of(context)', content)
    
    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(TARGET_DIR):
    for file in files:
        if file.endswith('.dart'):
            process_file(os.path.join(root, file))
