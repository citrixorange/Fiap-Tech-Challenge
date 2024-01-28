import { IsArray, ValidateNested, Length, IsCurrency, IsNumber, IsPositive, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

import { 
    IItemPedido,
    IPedido,
    IPedidoTotal 
} from "../../../core/domain/item.pedido.interface"

import { CadastrarClienteDto } from "../../../../cliente/adapter/driver/api/cliente.dto";

export class ItemPedidoDto implements IItemPedido {
    
    @Length(1, 30)
    nome: string;
    
    @IsNumber()
    @IsPositive()
    quantidade: number;
    
    @IsCurrency({
        symbol: 'R$',
        require_symbol: true,
        allow_decimal: true,
        digits_after_decimal: [2]
    })
    preco: string;
}

export class PedidoDto implements IPedido {
    
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(50)
    @ValidateNested({ each: true})
    @Type(() => ItemPedidoDto)
    item: ItemPedidoDto[];
}

export class PedidoTotalDto implements IPedidoTotal {
    
    @ValidateNested({ each: true})
    @Type(() => PedidoDto)
    pedido: PedidoDto;

    @ValidateNested({ each: true})
    @Type(() => CadastrarClienteDto)
    cliente: CadastrarClienteDto;
}
