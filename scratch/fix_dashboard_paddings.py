import os

files_to_fix = [
    "/Users/macbookair/Aller-Retour/apps/web/src/app/dashboard/client/colis/actifs/page.tsx",
    "/Users/macbookair/Aller-Retour/apps/web/src/app/dashboard/client/colis/franchise/page.tsx",
    "/Users/macbookair/Aller-Retour/apps/web/src/app/dashboard/client/colis/livres/page.tsx",
    "/Users/macbookair/Aller-Retour/apps/web/src/app/dashboard/client/colis/total/page.tsx",
    "/Users/macbookair/Aller-Retour/apps/web/src/app/dashboard/client/settings/page.tsx",
]

for file_path in files_to_fix:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace pt-24 with pt-6 sm:pt-10
        if 'pt-24' in content:
            new_content = content.replace('pt-24', 'pt-6 sm:pt-10')
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {file_path}")
        else:
            print(f"pt-24 not found in {file_path}")
    else:
        print(f"File not found: {file_path}")
