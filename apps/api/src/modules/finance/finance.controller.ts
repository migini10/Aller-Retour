import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentSettlementEngine } from './settlement.engine';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { Permissions } from '../../core/rbac/permissions.decorator';
import { UserRole } from '@aller-retour/database';

@ApiTags('Financial Engine & Payouts')
@Controller('finance')
@UseGuards(AuthGuard('jwt'), RbacGuard)
@ApiBearerAuth()
export class FinanceController {
  constructor(private readonly settlementEngine: PaymentSettlementEngine) {}

  @Post('settle/:bookingId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @Permissions('finance:escrow_release')
  @ApiOperation({ summary: 'Déclencher la répartition des fonds séquestrés d\'un billet (Gross -> Taxes -> Frais -> Commission -> Net)' })
  async settleTicket(@Param('bookingId') bookingId: string) {
    return this.settlementEngine.settleTripTicket(bookingId);
  }

  @Post('payout')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.DRIVER)
  @Permissions('wallets:withdraw')
  @ApiOperation({ summary: 'Déclencher un virement instantané (Cash-out) vers Wave / OM' })
  async instantPayout(@Body() body: { walletId: string; amount: number; phone: string }) {
    return this.settlementEngine.triggerInstantPayout(body.walletId, body.amount, body.phone);
  }
}
