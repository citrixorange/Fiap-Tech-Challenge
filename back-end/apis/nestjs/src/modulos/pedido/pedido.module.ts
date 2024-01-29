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


@Module({
  imports: 
    [
      TypeOrmModule.forFeature([
        ItemCardapio,
        Cliente,
        ItemPedido,
        PedidoProtocolado
      ])
    ],
  controllers: [PedidoController],
  providers: [
    PedidoService,
    {
        provide: 'IRegistroPedido',
        useClass: PedidoRepository
    },
    PedidoRepository
  ],
})
export class PedidoModule {}