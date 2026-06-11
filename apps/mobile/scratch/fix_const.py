import os
import re

TARGET_DIR = "/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client"

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content

    # Replace `const BoxDecoration(` with `BoxDecoration(` if Theme.of(context) is inside it
    # Since regex multiline is tricky, let's just replace all `const BoxDecoration` with `BoxDecoration`
    # if the file contains Theme.of(context).cardColor or Theme.of(context).dividerColor
    # Actually, removing `const ` from `const BoxDecoration` globally in these files is safe enough for compilation.
    # The linter might complain about missing const, but it won't break compilation!
    
    # Better: just remove `const ` before `BoxDecoration` if it is followed by `color: Theme.of(context)`
    # This might span newlines.
    content = re.sub(r'const\s+BoxDecoration\(\s*color:\s*Theme\.of\(context\)', r'BoxDecoration(color: Theme.of(context)', content)
    
    # What about `const BoxDecoration(\n            color: Theme.of(context)`
    content = re.sub(r'const\s+BoxDecoration\(\s*color:\s*Theme\.of\(context\)', r'BoxDecoration(color: Theme.of(context)', content, flags=re.MULTILINE)
    
    # What about `decoration: const BoxDecoration(\n              color: Theme.of(context)`
    content = re.sub(r'const\s+BoxDecoration\(\s*color:\s*Theme\.of\(context\)', r'BoxDecoration(\ncolor: Theme.of(context)', content)

    # Let's just do a naive approach: Find all indices of 'Theme.of(context)' and remove the nearest 'const' before it if it's on the same line or previous line.
    # Easier: Just run dart format and let dart fix it? No dart format doesn't fix const errors.

    # Let's use a simpler regex that matches any whitespace between `BoxDecoration(` and `color: Theme.of(context)`
    content = re.sub(r'const\s+BoxDecoration\(\s*color:\s*Theme\.of\(context\)', r'BoxDecoration(color: Theme.of(context)', content)
    
    # Let's just remove `const ` from `const BoxDecoration` if `Theme.of(context)` is nearby
    pieces = content.split('const BoxDecoration')
    for i in range(1, len(pieces)):
        # Check if Theme.of(context) is within the next 200 characters
        if 'Theme.of(context)' in pieces[i][:200]:
            pieces[i] = 'BoxDecoration' + pieces[i][13:] # wait, this is wrong logic.

    # Best regex:
    content = re.sub(r'const\s+BoxDecoration\(([^)]*Theme\.of\(context\)[^)]*)\)', r'BoxDecoration(\1)', content)

    # What if it's `const Color` ? Oh we removed `const Color(0xFF...)`.
    # What about `const EdgeInsets` ? That's fine.

    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(TARGET_DIR):
    for file in files:
        if file.endswith('.dart'):
            process_file(os.path.join(root, file))
