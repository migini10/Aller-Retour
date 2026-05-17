import { Injectable } from '@nestjs/common';

export interface CommissionBreakdown {
  platformFee: number;
  paymentGatewayFee: number;
  rateApplied: number;
}

@Injectable()
export class CommissionEngine {
  // Grille tarifaire Aller-Retour & Mobile Money
  private saasB2bRate = 0.05; // 5% pour GIE abonnés (SaaS)
  private marketplaceRate = 0.08; // 8% pour chauffeurs libres (B2C Marketplace)
  private mobileMoneyFeeRate = 0.01; // 1% frais de passerelle de transfert (Wave/OM)

  calculateCommission(grossAmount: number, isMarketplace: boolean): CommissionBreakdown {
    const rateApplied = isMarketplace ? this.marketplaceRate : this.saasB2bRate;
    const platformFee = Math.round(grossAmount * rateApplied);
    const paymentGatewayFee = Math.round(grossAmount * this.mobileMoneyFeeRate);

    return {
      platformFee,
      paymentGatewayFee,
      rateApplied,
    };
  }
}
