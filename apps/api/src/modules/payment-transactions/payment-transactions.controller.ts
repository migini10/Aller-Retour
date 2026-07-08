import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { UserRole } from '@aller-retour/database';

import { PaymentTransactionsService } from './payment-transactions.service';
import { ListPaymentTransactionsDto } from './dto/list-payment-transactions.dto';

@ApiTags('Payment Transactions')
@Controller('payment-transactions')
@UseGuards(AuthGuard('jwt'), RbacGuard)
@Roles(UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class PaymentTransactionsController {
  constructor(private readonly paymentTransactionsService: PaymentTransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste paginée des transactions de paiement' })
  async findAll(@Query() dto: ListPaymentTransactionsDto) {
    return this.paymentTransactionsService.findAll(dto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Résumé financier (total succès, échecs, etc.)' })
  async getSummary() {
    return this.paymentTransactionsService.getSummary();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail complet de la transaction de paiement' })
  async findOne(@Param('id') id: string) {
    return this.paymentTransactionsService.findOne(id);
  }
}
