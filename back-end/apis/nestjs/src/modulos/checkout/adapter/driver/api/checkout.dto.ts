import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { PedidoTotalDto } from "../../../../pedido/adapter/driver/api/pedido.dto";

import {
    QrCodeGenRequest
} from "../../../core/applications/ports/checkout.interface";

export class GerarQrCodeDto implements QrCodeGenRequest {

    @ApiProperty()
    @ValidateNested({ each: true})
    @Type(() => PedidoTotalDto)
    pedido: PedidoTotalDto;

};
