import { IsArray, ValidateNested, Length, IsOptional, IsCurrency, IsNumber, Max, IsPositive, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
    QrCodeGenRequest
} from "../../../core/applications/ports/checkout.interface";

import { 
    ICheckoutItemPedido,
    ICheckoutPedido,
    ICheckoutPedidoTotal 
} from "../../../core/domain/payments.interface"

import { CadastrarClienteDto } from "../../../../cliente/adapter/driver/api/cliente.dto";

import { config } from "../../../../../config/global_config";

export class CheckoutItemPedidoDto implements ICheckoutItemPedido {
    
    @Length(1, 30)
    nome: string;
    
    @IsNumber()
    @IsPositive()
    @Max(
        config["max_order_quantity"],
        {
            message: config["errors"]["messages"]["quantidade_maxima_excedida"]
        }
    )
    quantidade: number;
    
    @IsCurrency({
        symbol: 'R$',
        require_symbol: true,
        allow_decimal: true,
        digits_after_decimal: [2]
    })
    preco: string;
}

export class CheckoutPedidoDto implements ICheckoutPedido {
    
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(50)
    @ValidateNested({ each: true})
    @Type(() => CheckoutItemPedidoDto)
    item: CheckoutItemPedidoDto[];
}

export class CheckoutPedidoTotalDto implements ICheckoutPedidoTotal {
    
    @ValidateNested({ each: true})
    @Type(() => CheckoutPedidoDto)
    pedido: CheckoutPedidoDto;

    @IsOptional()
    @ValidateNested({ each: true})
    @Type(() => CadastrarClienteDto)
    cliente?: CadastrarClienteDto;
}

export class GerarQrCodeDto implements QrCodeGenRequest {

    @ApiProperty()
    @ValidateNested({ each: true})
    @Type(() => CheckoutPedidoTotalDto)
    pedido: CheckoutPedidoTotalDto;

};

