import { Module } from '@nestjs/common';
import { ClienteModule } from './modulos/cliente/cliente.module';
import { CardapioModule } from './modulos/cardapio/cardapio.module';
import { CheckoutModule } from './modulos/checkout/checkout.module';
import { PedidoModule } from './modulos/pedido/pedido.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import ormConfig from './config/orm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig()),
    HttpModule,
    ClienteModule,
    CardapioModule,
    CheckoutModule,
    PedidoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
