import { IsEmail, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICliente } from '../../../core/domain/cliente.interface';

export class CadastrarClienteDto implements ICliente {

  @ApiProperty()
  @Length(1, 30)
  nome: string;

  @ApiProperty()
  @Length(11, 11)
  cpf: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  constructor(nome: string, cpf: string, email: string) {
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
  }
}

export class IdentificarClienteDto implements ICliente {

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @Length(1, 30)
  nome: string;

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @Length(11, 11)
  cpf: string;

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email: string;

}