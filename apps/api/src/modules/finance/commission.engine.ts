import { Injectable } from '@nestjs/common';

export interface CommissionBreakdown {
  platformFee: number;
  paymentGatewayFee: number;
  rateApplied: number;
}

@Injectable()
export class CommissionEngine {
  // Grille tarifaire Aller-Retour & Mobile Money
  private saasB2bRate = 0.03; // 3% pour GIE abonnés (SaaS)
  private marketplaceRate = 0.03; // 3% pour chauffeurs libres (B2C Marketplace)
  private mobileMoneyFeeRate = 0.00; // 0% frais de passerelle

  calculateCommission(grossAmount: number, isMarketplace: boolean): CommissionBreakdown {
    const rateApplied = 0.03;
    const platformFee = Math.round(grossAmount * rateApplied);
    const paymentGatewayFee = 0;

    return {
      platformFee,
      paymentGatewayFee,
      rateApplied,
    };
  }
}
