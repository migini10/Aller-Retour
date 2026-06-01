#!/bin/bash
FILE="apps/web/src/app/dashboard/client/page.tsx"

sed -i '' 's/bg-\[#141414\]/bg-white dark:bg-\[#141414\]/g' $FILE
sed -i '' 's/bg-\[#1A1A1A\]/bg-slate-50 dark:bg-\[#1A1A1A\]/g' $FILE
sed -i '' 's/bg-\[#222222\]/bg-slate-100 dark:bg-\[#222222\]/g' $FILE
sed -i '' 's/bg-\[#0A0A0A\]/bg-slate-50 dark:bg-\[#0A0A0A\]/g' $FILE
sed -i '' 's/border-\[#2A2A2A\]/border-slate-200 dark:border-\[#2A2A2A\]/g' $FILE
sed -i '' 's/border-\[#333333\]/border-slate-300 dark:border-\[#333333\]/g' $FILE
sed -i '' 's/text-white/text-slate-900 dark:text-white/g' $FILE
sed -i '' 's/text-slate-300/text-slate-700 dark:text-slate-300/g' $FILE
sed -i '' 's/text-slate-400/text-slate-500 dark:text-slate-400/g' $FILE
