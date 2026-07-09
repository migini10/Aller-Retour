import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class PricingService {
  constructor(private readonly settingsService: SettingsService) {}
  /**
   * Calculates carpooling passenger fee, driver net earning, and total platform cut.
   * basePrice is set per seat/trip.
   * Client pays: basePrice + 3%
   * Driver receives: basePrice - 3%
   * Platform commission: 6% total (3% client fee + 3% driver fee)
   */
  async calculatePricing(basePrice: number) {
    const settings = await this.settingsService.getSettings();
    
    const clientFee = Math.round(basePrice * (settings.clientCommissionRate / 100));
    const driverFee = Math.round(basePrice * (settings.driverCommissionRate / 100));
    const amountPaid = basePrice + clientFee;
    const driverCut = basePrice - driverFee;
    const platformCommission = clientFee + driverFee;

    return {
      basePrice,
      clientFee,
      amountPaid,
      driverCut,
      platformCommission,
    };
  }
}
