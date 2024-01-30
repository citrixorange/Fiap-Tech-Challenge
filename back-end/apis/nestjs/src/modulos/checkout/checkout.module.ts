import { Module } from '@nestjs/common';
import { CheckoutService } from './core/applications/services/checkout.service';
import { CheckoutController } from './adapter/driver/api/checkout.controller';
import { HttpModule } from '@nestjs/axios';
import { PagBankGateway } from './adapter/driven/pagBank/checkout.gateway.provider';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    {
        provide: 'ICheckout',
        useClass: PagBankGateway
    },
    PagBankGateway
  ],
})
export class CheckoutModule {}