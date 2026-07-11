const fs = require('fs');
const files = [
    'apps/web/src/app/auth/login/page.tsx',
    'apps/web/src/app/dashboard/driver/sections/Accueil.tsx',
    'apps/web/src/app/dashboard/driver/sections/Revenus.tsx',
    'apps/web/src/app/dashboard/client/sections/Parametres.tsx',
    'apps/web/src/app/dashboard/client/transactions/page.tsx',
    'apps/web/src/app/dashboard/client/wallet/page.tsx',
    'apps/web/src/components/PinLockScreen.tsx',
    'apps/web/src/components/BookingWizardModal.tsx',
    'apps/web/src/components/AuthContext.tsx',
    'apps/web/src/components/WithdrawalWizardModal.tsx'
];
for(const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  if(content.includes('getApiUrl') && !content.includes('import { getApiUrl }')) {
    const importStmt = "import { getApiUrl } from '@/lib/config';\n";
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
            lines.splice(i, 0, importStmt.trim());
            break;
        }
    }
    fs.writeFileSync(f, lines.join('\n'));
    console.log('Fixed', f);
  }
}
