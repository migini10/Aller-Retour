
'use client';

import React from 'react';
import { AdminSearchBar } from '../../components/forms/AdminSearchBar';

export function UserSearch({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return <AdminSearchBar value={value} onChange={onChange} placeholder="Rechercher par nom, email, téléphone..." />;
}