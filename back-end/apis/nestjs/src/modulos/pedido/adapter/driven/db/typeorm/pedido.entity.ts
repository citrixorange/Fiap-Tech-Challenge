import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { StatusPedido } from '../../../../core/domain/item.pedido.interface';
import { Cliente } from '../../../../../cliente/adapter/driven/db/typeorm/cliente.entity';
import { ItemCardapio } from '../../../../../cardapio/adapter/driven/db/typeorm/cardapio.entity';

import {
  IItemPedido,
  IPedidoProtocolado  
} from "../../../../core/domain/item.pedido.interface";


@Entity()
export class ItemPedido extends BaseEntity implements IItemPedido {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantidade: number;

  @ManyToOne(() => ItemCardapio, { eager: true })
  item: Relation<ItemCardapio>;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => PedidoProtocolado, (pedido_protocolado) => pedido_protocolado.pedido)
  pedido_protocolado: Relation<PedidoProtocolado>;

  constructor(quantidade: number, item: ItemCardapio, createdAt: Date) {
    super();
    this.quantidade = quantidade;
    this.item = item;
    this.createdAt = createdAt;
  }
}

@Entity()
export class PedidoProtocolado extends BaseEntity implements IPedidoProtocolado {

  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Cliente, { cascade: ['insert'], eager: true })
  @JoinColumn()
  cliente: Relation<Cliente>;

  @OneToMany(() => ItemPedido, itemPedido => itemPedido.pedido_protocolado, { cascade: true, eager: true })
  @JoinColumn()
  pedido: Relation<ItemPedido>[];

  @Column()
  status: StatusPedido;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  receivedAt: Date;

  @Column({ type: 'timestamptz' })
  preparedAt: Date;

  @Column({ type: 'timestamptz' })
  doneAt: Date;

  constructor(id: string, cliente: Cliente, pedido: ItemPedido[], createdAt: Date) {
    super();
    this.id = id;
    this.cliente = cliente;
    this.pedido = pedido;
    this.status = StatusPedido.RECEBIDO;
    this.createdAt = createdAt;
    this.receivedAt = createdAt;
    this.preparedAt = createdAt;
    this.doneAt = createdAt;
  }

}