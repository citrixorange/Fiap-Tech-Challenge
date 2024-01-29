import { Module } from '@nestjs/common';
import { ClienteModule } from './modulos/cliente/cliente.module';
import { CardapioModule } from './modulos/cardapio/cardapio.module';
import { CheckoutModule } from './modulos/checkout/checkout.module';
import { PedidoModule } from './modulos/pedido/pedido.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import * as process from 'node:process';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import checkoutConfig from "./config/checkout.config";



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig, checkoutConfig],
      expandVariables: true,
      envFilePath: join(__dirname, `../environment/${process.env.NODE_ENV}/.${process.env.NODE_ENV}.env`)
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'prod'
        ? ormConfig : ormConfigProd
    }),
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
