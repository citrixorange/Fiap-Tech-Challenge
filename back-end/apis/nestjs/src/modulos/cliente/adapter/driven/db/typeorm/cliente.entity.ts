import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ICliente } from '../../../../core/domain/cliente.interface';

@Entity()
export class Cliente extends BaseEntity implements ICliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  cpf: string;

  @Column()
  email: string;

  constructor(nome: string, cpf: string, email: string) {
    super();
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
  }
}
