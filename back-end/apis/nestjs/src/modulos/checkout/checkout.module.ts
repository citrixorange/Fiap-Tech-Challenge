import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { CheckoutService } from './core/applications/services/checkout.service';
import { CheckoutController } from './adapter/driver/api/checkout.controller';
import { HttpModule } from '@nestjs/axios';
import { PagBankGateway } from './adapter/driven/pagBank/checkout.gateway.provider';
import checkoutConfig from '../../config/checkout.config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [checkoutConfig],
      expandVariables: true,
      envFilePath: join(__dirname, `../../../environment/dev/.dev.env`)
    }),
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