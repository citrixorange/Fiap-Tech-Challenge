import { Length, IsCurrency, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IItem } from '../../../core/domain/item.interface';
import { Categoria } from '../../../core/domain/categoria';

export class CreateCardapioDto implements IItem {

  @ApiProperty()
  @Length(1, 30)
  nome: string;

  @ApiProperty()
  @Length(1, 100)
  descricao: string;

  @ApiProperty()
  @IsEnum(
    Categoria,
    {
      message: 'Categoria Inválida. Por favor consulte a documentação.'
    }
  )
  categoria: Categoria;

  @ApiProperty()
  @IsCurrency({
    symbol: 'R$',
    require_symbol: true,
    allow_decimal: true,
    digits_after_decimal: [2]
  })
  preco: string;

  constructor(nome: string, descricao: string, categoria: Categoria, preco: string) {
    this.nome = nome;
    this.descricao = descricao;
    this.categoria = categoria;
    this.preco = preco;
  }
}

export class EditarCardapioDto extends PartialType(CreateCardapioDto) {}

export class ListarCardapioDto {

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsEnum(
    Categoria,
    {
      message: 'Categoria Inválida. Por favor consulte a documentação.'
    }
  )
  categoria: Categoria;

}

export class QueryCardapioDto {

  @ApiProperty()
  @Length(1, 30)
  nome: string;

}

