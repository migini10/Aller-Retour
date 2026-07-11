const fs = require('fs');

const files = [
    'apps/web/src/app/dashboard/client/page.tsx',
    'apps/web/src/app/dashboard/client/qr-code/history/page.tsx',
    'apps/web/src/app/dashboard/client/qr-code/page.tsx'
];

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace the getApiUrl function body entirely or just replace the fallback
    // In client/page.tsx:
    // const getApiUrl = () => {
    //   const envUrl = process.env.NEXT_PUBLIC_API_URL;
    //   if (envUrl) return envUrl;
    //   if (typeof window !== 'undefined') { ... }
    
    const importStmt = "import { getApiUrl } from '@/lib/config';\n";
    if (!content.includes(importStmt.trim())) {
        let lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import ')) {
                lines.splice(i, 0, importStmt.trim());
                break;
            }
        }
        content = lines.join('\n');
    }
    
    // Remove the custom getApiUrl if it exists
    const match = content.match(/const getApiUrl = \(\) => \{[\s\S]*?\};\n/);
    if (match) {
        content = content.replace(match[0], '');
    }

    fs.writeFileSync(f, content);
    console.log('Patched', f);
}
