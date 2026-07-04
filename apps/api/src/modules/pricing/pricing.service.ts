import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingService {
  /**
   * Calculates carpooling passenger fee, driver net earning, and total platform cut.
   * basePrice is set per seat/trip.
   * Client pays: basePrice + 3%
   * Driver receives: basePrice - 3%
   * Platform commission: 6% total (3% client fee + 3% driver fee)
   */
  calculatePricing(basePrice: number) {
    const clientFee = Math.round(basePrice * 0.03);
    const amountPaid = basePrice + clientFee;
    const driverCut = Math.round(basePrice * 0.97);
    const platformCommission = amountPaid - driverCut;

    return {
      basePrice,
      clientFee,
      amountPaid,
      driverCut,
      platformCommission,
    };
  }
}
