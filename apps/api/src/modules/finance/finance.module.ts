import { Module } from '@nestjs/common';
import { TaxEngine } from './tax.engine';
import { CommissionEngine } from './commission.engine';
import { PaymentSettlementEngine } from './settlement.engine';
import { FinanceController } from './finance.controller';

@Module({
  controllers: [FinanceController],
  providers: [TaxEngine, CommissionEngine, PaymentSettlementEngine],
  exports: [PaymentSettlementEngine],
})
export class FinanceModule {}
