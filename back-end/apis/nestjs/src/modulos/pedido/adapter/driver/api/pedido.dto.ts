import { IsArray, ValidateNested, Length, IsCurrency, IsNumber, IsPositive, Max, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize, IsString, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";
import { StatusPedido, statusPedidoFromJSON } from '../../../core/domain/item.pedido.interface';
import { 
    PaymentGateway,
    paymentGatewayFromJSON,
    PaymentMethods,
    paymentMethodsFromJSON, 
    PaymentStatus,
    paymentStatusFromJSON 
} from '../../../../checkout/core/domain/payments.interface';

import {    
    IRegistarRequest,
    IAtualizarPagamentoRequest,
} from '../../../core/applications/ports/pedido.interface';

import {    
    IItemPedido
} from '../../../core/domain/item.pedido.interface';

import { CadastrarClienteDto } from "../../../../cliente/adapter/driver/api/cliente.dto";

import { config } from "../../../../../config/global_config";

export class ItemPedidoDto implements IItemPedido {
    
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

export class RegistrarPedidoDto implements IRegistarRequest {

    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsOptional()
    @ValidateNested({ each: true})
    @Type(() => CadastrarClienteDto)
    cliente: CadastrarClienteDto;

    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(50)
    @ValidateNested({ each: true})
    @Type(() => ItemPedidoDto)
    pedido: ItemPedidoDto[];

    @ApiProperty()
    @Transform(({ value }) => statusPedidoFromJSON(value))
    @IsOptional()
    @IsEnum(
        StatusPedido,
        {
            message: config["errors"]["messages"]["status_pedido_invalido"]
        }
    )
    status: StatusPedido;

    @ApiProperty()
    @Transform(({ value }) => paymentGatewayFromJSON(value))
    @IsOptional()
    @IsEnum(
        PaymentGateway,
        {
            message: config["errors"]["messages"]["gateway_pagamento_invalido"]
        }
    )
    paymentGateway: PaymentGateway;

    @ApiProperty()
    @Transform(({ value }) => paymentMethodsFromJSON(value))
    @IsOptional()
    @IsEnum(
        PaymentMethods,
        {
            message: config["errors"]["messages"]["metodo_pagamento_invalido"]
        }
    )
    paymentMethod: PaymentMethods;

    @ApiProperty()
    @Transform(({ value }) => paymentStatusFromJSON(value))
    @IsOptional()
    @IsEnum(
        PaymentStatus,
        {
            message: config["errors"]["messages"]["status_pagamento_invalido"]
        }
    )
    paymentStatus: PaymentStatus;


}

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
            message: config["errors"]["messages"]["status_pedido_invalido"]
        }
    )
    status?: StatusPedido;
  
}

export class AtualizarPagamentoDto implements IAtualizarPagamentoRequest {
    
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @Transform(({ value }) => paymentStatusFromJSON(value))
    @IsOptional()
    @IsEnum(
        PaymentStatus,
        {
            message: config["errors"]["messages"]["status_pagamento_invalido"]
        }
    )
    paymentStatus: PaymentStatus;
};
