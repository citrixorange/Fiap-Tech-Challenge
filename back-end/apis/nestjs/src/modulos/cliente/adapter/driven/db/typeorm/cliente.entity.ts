import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ICliente } from '../../../../core/domain/cliente.interface';

@Entity()
export class Cliente extends BaseEntity implements ICliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  nome: string;

  @Column()
  @Index({ unique: true })
  cpf: string;

  @Column()
  @Index({ unique: true })
  email: string;

  constructor(nome: string, cpf: string, email: string) {
    super();
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
  }
}
