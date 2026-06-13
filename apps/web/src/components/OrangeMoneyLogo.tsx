import React from 'react';

export const OrangeMoneyLogo = ({ className = "w-6 h-6" }: { className?: string }) => {
  return (
    <svg className={`${className} transition-transform duration-300 hover:scale-[1.03] rounded-md`} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="black"/>
      <path className="transition-transform duration-300 origin-center hover:scale-[1.03]" fill="#ffffff" d="M80 175 C80 150 100 130 125 130 H220 C245 130 260 145 260 170 V270 C260 295 245 310 220 310 C195 310 180 295 180 270 V235 L125 290 C108 307 82 307 65 290 C48 273 48 247 65 230 L120 175 H80 Z"/>
      <path className="transition-transform duration-300 origin-center hover:scale-[1.03]" fill="#ff7900" d="M300 242 L355 187 C372 170 398 170 415 187 C432 204 432 230 415 247 L360 302 H405 C430 302 450 322 450 347 C450 372 430 392 405 392 H300 C275 392 260 377 260 352 V300 C260 275 275 260 300 260 Z"/>
    </svg>
  );
};
