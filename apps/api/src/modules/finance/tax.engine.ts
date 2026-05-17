import { Injectable } from '@nestjs/common';

export interface TaxBreakdown {
  totalTax: number;
  vatAmount: number;
  stationTax: number;
  countryCode: string;
}

@Injectable()
export class TaxEngine {
  // Règles fiscales par pays (Scalabilité Sénégal puis Afrique)
  private taxRules: Record<string, { vatRate: number; stationFeeFixed: number }> = {
    SN: { vatRate: 0.18, stationFeeFixed: 200 }, // Sénégal : 18% TVA + 200 FCFA Redevance Gare
    CI: { vatRate: 0.18, stationFeeFixed: 300 }, // Côte d'Ivoire
    ML: { vatRate: 0.18, stationFeeFixed: 250 }, // Mali
    CM: { vatRate: 0.1925, stationFeeFixed: 400 }, // Cameroun
  };

  calculateTaxes(grossAmount: number, countryCode: string = 'SN'): TaxBreakdown {
    const rules = this.taxRules[countryCode] || this.taxRules['SN'];
    
    // Calcul de la TVA sur le service (ex: TVA incluse ou calculée sur la part de frais de réservation)
    const vatAmount = Math.round(grossAmount * (rules.vatRate / (1 + rules.vatRate)));
    const stationTax = rules.stationFeeFixed;
    const totalTax = vatAmount + stationTax;

    return {
      totalTax,
      vatAmount,
      stationTax,
      countryCode,
    };
  }
}
