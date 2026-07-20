import re
import sys

def fix_file(filepath, lines_to_fix):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    # Process lines in reverse order so inserting doesn't change subsequent line numbers
    for line_num in sorted(list(set(lines_to_fix)), reverse=True):
        idx = line_num - 1
        line_content = lines[idx]
        indent = len(line_content) - len(line_content.lstrip())
        
        # Determine guard
        guard = " " * indent + "if (!mounted) return;\n"
        if "context" in line_content and "mounted" not in line_content:
            if "ScaffoldMessenger" in line_content or "Navigator" in line_content or "showDialog" in line_content or "showModalBottomSheet" in line_content or "Theme.of" in line_content:
                # Check if it's already guarded in the previous line
                if idx > 0 and "mounted" in lines[idx-1]:
                    continue
                # For functions like build, we use context.mounted, for State we use mounted
                # If we're inside a state class, mounted is available. We'll try to use `if (!mounted) return;`
                lines.insert(idx, guard)

    with open(filepath, 'w') as f:
        f.writelines(lines)

import collections
files_to_fix = collections.defaultdict(list)

# Read the log
with open('/Users/macbookair/.gemini/antigravity-ide/brain/554d4e7c-da98-4414-bb4c-86269f9cf787/.system_generated/tasks/task-23224.log', 'r') as f:
    for line in f:
        if "use_build_context_synchronously" in line:
            match = re.search(r"lib/([a-zA-Z0-9_/\.]+):(\d+):\d+", line)
            if match:
                filepath = "lib/" + match.group(1)
                linenum = int(match.group(2))
                files_to_fix[filepath].append(linenum)

for filepath, lines in files_to_fix.items():
    fix_file(filepath, lines)
    print(f"Fixed {filepath} at lines {lines}")
