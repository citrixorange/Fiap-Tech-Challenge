import { IPedido } from "src/modulos/pedido/core/applications/ports/pedido.interface";

export enum Gateway {
    MercadoPago
}

export enum MetodoPagamento {
    Pix
}

export interface IPagamento {
    criarSessaoPagamento(pedido: IPedido, gateway:Gateway, metodo_pagamento: MetodoPagamento);
    setSuccessCallback(callback: (metadata: object) => void);
    setCancelCallback(callback: (metadata: object) => void);
    setFailureCallback(callback: (metadata: object) => void);
}