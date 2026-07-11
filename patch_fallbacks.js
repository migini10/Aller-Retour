const fs = require('fs');
const path = require('path');

const files = [
    'apps/web/src/components/WithdrawalWizardModal.tsx',
    'apps/web/src/components/AuthContext.tsx',
    'apps/web/src/components/PinLockScreen.tsx',
    'apps/web/src/lib/api.client.ts',
    'apps/web/src/components/BookingWizardModal.tsx',
    'apps/web/src/app/dashboard/client/page.tsx',
    'apps/web/src/app/auth/login/page.tsx',
    'apps/web/src/app/dashboard/client/transactions/page.tsx',
    'apps/web/src/app/dashboard/client/wallet/page.tsx',
    'apps/web/src/app/dashboard/client/qr-code/history/page.tsx',
    'apps/web/src/app/dashboard/client/qr-code/page.tsx',
    'apps/web/src/app/dashboard/client/sections/Parametres.tsx',
    'apps/web/src/app/dashboard/driver/sections/Revenus.tsx',
    'apps/web/src/app/dashboard/driver/sections/Accueil.tsx'
];

const configCode = `export const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === 'production') {
    throw new Error("NEXT_PUBLIC_API_URL is missing in production environment");
  }
  return 'http://localhost:3333';
};
`;
fs.writeFileSync('apps/web/src/lib/config.ts', configCode);

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let content = fs.readFileSync(f, 'utf8');
    let modified = false;

    // Replace process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
    if (content.includes("process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'")) {
        content = content.split("process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'").join("getApiUrl()");
        modified = true;
    }
    
    const searchString = "process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/v1` : 'http://localhost:3333/v1'";
    if (content.includes(searchString)) {
        content = content.split(searchString).join("`${getApiUrl()}/v1`");
        modified = true;
    }

    if (modified) {
        const importStmt = "import { getApiUrl } from '@/lib/config';\n";
        if (!content.includes("getApiUrl")) {
            let lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('import ')) {
                    lines.splice(i, 0, importStmt.trim());
                    break;
                }
            }
            content = lines.join('\n');
        }
        fs.writeFileSync(f, content);
        console.log('Patched', f);
    }
}
