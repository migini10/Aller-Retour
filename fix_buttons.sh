#!/bin/bash
FILE="apps/web/src/app/dashboard/client/page.tsx"

# Fix orange button text colors
sed -i '' 's/bg-orange-600 hover:bg-orange-500 text-slate-900 dark:text-white/bg-orange-600 hover:bg-orange-500 text-white/g' $FILE
sed -i '' "s/'bg-orange-600 text-slate-900 dark:text-white font-semibold shadow-sm'/'bg-orange-600 text-white font-semibold shadow-sm'/g" $FILE
sed -i '' "s/'bg-orange-600 text-slate-900 dark:text-white shadow-md'/'bg-orange-600 text-white shadow-md'/g" $FILE
sed -i '' 's/bg-orange-600 px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white/bg-orange-600 px-4 py-2 text-xs font-semibold text-white/g' $FILE

# Fix modal icons (WhatsApp, Email, Bluetooth) which have colored background circles
sed -i '' 's/<MessageCircle className="w-5 h-5 text-slate-900 dark:text-white" \/>/<MessageCircle className="w-5 h-5 text-white" \/>/g' $FILE
sed -i '' 's/<Mail className="w-5 h-5 text-slate-900 dark:text-white" \/>/<Mail className="w-5 h-5 text-white" \/>/g' $FILE
sed -i '' 's/<Bluetooth className="w-5 h-5 text-slate-900 dark:text-white" \/>/<Bluetooth className="w-5 h-5 text-white" \/>/g' $FILE

# Fix text-slate-300 logic
sed -i '' 's/text-slate-700 dark:text-slate-300/text-slate-700 dark:text-slate-300/g' $FILE
