import { Module } from '@nestjs/common';
import { PedidoService } from './core/applications/services/pedido.service';
import { PedidoController } from './adapter/driver/api/pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteModule } from '../cliente/cliente.module';
import { CardapioModule } from '../cardapio/cardapio.module';
import { ItemCardapio } from '../cardapio/adapter/driven/db/typeorm/cardapio.entity';
import { Cliente } from '../cliente/adapter/driven/db/typeorm/cliente.entity';
import { ItemPedido, PedidoProtocolado } from "./adapter/driven/db/typeorm/pedido.entity";
import { PedidoRepository } from './adapter/driven/db/typeorm/pedido.repository';
import { ClienteService } from '../cliente/core/applications/services/cliente.service';
import { ClienteRepository } from '../cliente/adapter/driven/db/typeorm/cliente.repository';
import { CardapioService } from '../cardapio/core/applications/services/cardapioService';
import { CardapioRepository } from '../cardapio/adapter/driven/db/typeorm/cardapio.repository';


@Module({
  imports: 
    [
      TypeOrmModule.forFeature([
        ItemCardapio,
        Cliente,
        ItemPedido,
        PedidoProtocolado
      ]),
      ClienteModule,
      CardapioModule,

    ],
  controllers: [PedidoController],
  providers: [
    PedidoService,
    PedidoRepository,
    {
      provide: 'ClienteService',
      useClass: ClienteService
    },
    {
      provide: 'CardapioService',
      useClass: CardapioService
    },
    {
        provide: 'IRegistroPedido',
        useClass: PedidoRepository
    },
    {
      provide: 'ICadastroCliente',
      useClass: ClienteRepository
    },
    {
      provide: 'ICardapio',
      useClass: CardapioRepository
    },
    ClienteService,
    CardapioService,
  ],
})
export class PedidoModule {}