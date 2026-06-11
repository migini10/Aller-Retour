import os

file_path = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/home_screen.dart'

with open(file_path, 'r') as f:
    content = f.read()

# I will fix lines 75 to 88 manually
# First, let me retrieve the content and find the index
lines = content.split('\n')
for i, line in enumerate(lines):
    if 'endDrawer: AppDrawer(' in line:
        start_idx = i
        break

# I know it should end around start_idx + 8
# Let's just fix it by string replacement of the mangled part
# The mangled part is:
#           setState(() {
#             isDriverMode = newMode;
#           });
#       ),
#     ),
#     );

correct_str = """          setState(() {
            isDriverMode = newMode;
          });
        },
      ),
    ),
    );"""

mangled_str = """          setState(() {
            isDriverMode = newMode;
          });
      ),
    ),
    );"""

if mangled_str in content:
    content = content.replace(mangled_str, correct_str)
    with open(file_path, 'w') as f:
        f.write(content)
        print("Fixed!")
else:
    print("Not found")

