import { Metadata } from 'next';
import VehiclesView from './components/VehiclesView';

export const metadata: Metadata = {
  title: 'Véhicules | Aller-Retour Admin',
  description: 'Gestion des véhicules des chauffeurs',
};

export default function VehiclesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Véhicules</h2>
      </div>
      <VehiclesView />
    </div>
  );
}
