import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IItemCardapio } from "../../../../core/domain/item.interface";
import { Categoria } from '../../../../core/domain/categoria';

@Entity()
export class ItemCardapio extends BaseEntity implements IItemCardapio {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column()
  categoria: Categoria;

  @Column()
  preco: string;

  constructor(nome: string, descricao: string, categoria: Categoria, preco: string) {
    super();
    this.nome = nome;
    this.descricao = descricao;
    this.categoria = categoria;
    this.preco = preco;
  }
}