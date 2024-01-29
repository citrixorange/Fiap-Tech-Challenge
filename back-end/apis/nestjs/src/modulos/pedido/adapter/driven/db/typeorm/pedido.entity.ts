import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
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
  @JoinColumn()
  item: ItemCardapio;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

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
  cliente: Cliente;

  @OneToMany(() => ItemPedido, itemPedido => itemPedido, { cascade: true, eager: true })
  pedido: ItemPedido[];

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