import { IsArray, ValidateNested, Length, IsCurrency, IsNumber, IsPositive, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize, IsString, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";
import { StatusPedido, statusPedidoFromJSON } from '../../../core/domain/item.pedido.interface';

export class PatchPedidoDto {
    @ApiProperty()
    @IsString()
    id: string;
};

export class ListarPedidoDto {

    @ApiProperty({
        required: false
    })
    @Transform(({ value }) => statusPedidoFromJSON(value))
    @IsOptional()
    @IsEnum(
        StatusPedido,
        {
            message: 'Status Pedido Inválido. Por favor consulte a documentação.'
        }
    )
    status?: StatusPedido;
  
}
