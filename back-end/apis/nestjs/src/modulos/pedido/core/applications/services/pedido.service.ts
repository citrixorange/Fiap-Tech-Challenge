import { Inject } from "@nestjs/common";

import {
    IRegistroPedido,
    IRegistarRequest,
    IRegistarResponse,
    IIniciarPreparoRequest,
    IIniciarPreparoResponse,
    ITerminarPreparoRequest,
    ITerminarPreparoResponse,
    IFinalizarRequest,
    IFinalizarResponse,
    IListarRequest,
    IListarResponse,
    IAtualizarPagamentoRequest,
    IAtualizarPagamentoResponse
} from "../ports/pedido.interface";

export class PedidoService {
    
    constructor(
        @Inject('IRegistroPedido')
        private readonly pedidoRepository: IRegistroPedido
    ) {}

    async registrar(request: IRegistarRequest): Promise<IRegistarResponse> {
        return await this.pedidoRepository.registrar(request);
    }

    async iniciarPreparo(request: IIniciarPreparoRequest): Promise<IIniciarPreparoResponse> {
        return await this.pedidoRepository.iniciarPreparo(request);
    }

    async terminarPreparo(request: ITerminarPreparoRequest): Promise<ITerminarPreparoResponse> {
        return await this.pedidoRepository.terminarPreparo(request);
    }

    async finalizar(request: IFinalizarRequest): Promise<IFinalizarResponse> {
        return await this.pedidoRepository.finalizar(request);
    }

    async listar(request: IListarRequest): Promise<IListarResponse> {
        return await this.pedidoRepository.listar(request);
    }

    async atualizarStatusPagamento(request: IAtualizarPagamentoRequest): Promise<IAtualizarPagamentoResponse> {
        return await this.pedidoRepository.atualizarStatusPagamento(request);
    }

}