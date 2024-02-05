import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { PedidoProtocolado, ItemPedido } from './pedido.entity';
import { Cliente } from '../../../../../cliente/adapter/driven/db/typeorm/cliente.entity';
import { ClienteService } from "../../../../../cliente/core/applications/services/cliente.service";
import { CardapioService } from "../../../../../cardapio/core/applications/services/cardapioService";
import { ItemCardapio } from '../../../../../cardapio/adapter/driven/db/typeorm/cardapio.entity';
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
    IListarResponse
} from "../../../../core/applications/ports/pedido.interface";
import { StatusPedido } from "../../../../core/domain/item.pedido.interface";

import { config } from "../../../../../../config/global_config";

@Injectable()
export class PedidoRepository implements IRegistroPedido {

    cardapioCache: Map<String, ItemCardapio> = new Map();

    constructor(
        @InjectRepository(PedidoProtocolado)
        private readonly pedidoRepository: Repository<PedidoProtocolado>,

        @Inject('ClienteService')
        private readonly clienteService: ClienteService,

        @Inject('CardapioService')
        private readonly cardapioService: CardapioService,

    ) {}

    async getItemCardapioByNome(nome: String): Promise<ItemCardapio | undefined> {

        if(this.cardapioCache.size == 0 ) {
            const response = await this.cardapioService.listarItem({});
            const itens = response.item;
            for(const item of itens) {
                this.cardapioCache.set(item.nome, item as ItemCardapio);
            }
        }

        return this.cardapioCache.get(nome);
    }

    public async registrar(request: IRegistarRequest): Promise<IRegistarResponse> {
        try {

            let object = JSON.parse(JSON.stringify(request.pedido));

            let cpfCliente = object.customer.tax_id;

            let pedido: ItemPedido[] = [];

            for(const itemPedido of object.items) {
                let itemCardapio = await this.getItemCardapioByNome(itemPedido.name);

                if(!itemCardapio) {
                    throw new Error(config["errors"]["messages"]["item_cardapio_nao_encontrado"]);
                }

                let item = new ItemPedido(itemPedido.quantity, itemCardapio, object.created_at);
                pedido.push(item);
            }

            let clienteResponse = await this.clienteService.identificarCliente({
                cpf: cpfCliente
            });

            /*if(!cliente) {
                cliente = new Cliente(
                    object.customer.name, 
                    object.customer.tax_id,
                    object.customer.email
                );
            }*/

            let pedidoProtocolo = new PedidoProtocolado(object.reference_id, clienteResponse.cliente as Cliente, pedido, object.created_at);

            let protocol = await this.pedidoRepository.save(pedidoProtocolo);

            return {
                protocolo: protocol
            };

        } catch(error) {
            console.log(error);
            throw new Error(config["errors"]["messages"]["unexpected_error"]);
        }
    }

    public async iniciarPreparo(request: IIniciarPreparoRequest): Promise<IIniciarPreparoResponse> {
        
        try {
            let pedido = await this.pedidoRepository.findOne({
                where: {
                    id: request.id
                }
            });

            if(!pedido) {
                throw new Error(config["errors"]["messages"]["pedido_nao_encontrado"]);
            }

            pedido.receivedAt = new Date();
            pedido.status = StatusPedido.PREPARANDO;

            pedido = await this.pedidoRepository.save(pedido);

            return {
                protocolo: pedido
            };

        } catch(error) {
            console.log(error);
            throw new Error(config["errors"]["messages"]["unexpected_error"]);
        }

    }

    public async terminarPreparo(request: ITerminarPreparoRequest): Promise<ITerminarPreparoResponse> {

        try {
            let pedido = await this.pedidoRepository.findOne({
                where: {
                    id: request.id
                }
            });

            if(!pedido) {
                throw new Error(config["errors"]["messages"]["pedido_nao_encontrado"]);
            }

            pedido.preparedAt = new Date();
            pedido.status = StatusPedido.FINALIZADO;

            pedido = await this.pedidoRepository.save(pedido);

            return {
                protocolo: pedido
            };

        } catch(error) {
            console.log(error);
            return error;
        }
    }

    public async finalizar(request: IFinalizarRequest): Promise<IFinalizarResponse> {
        try {
            let pedido = await this.pedidoRepository.findOne({
                where: {
                    id: request.id
                }
            });

            if(!pedido) {
                throw new Error(config["errors"]["messages"]["pedido_nao_encontrado"]);
            }

            pedido.doneAt = new Date();
            pedido.status = StatusPedido.PRONTO;

            pedido = await this.pedidoRepository.save(pedido);

            return {
                protocolo: pedido
            };

        } catch(error) {
            console.log(error);
            return error;
        }

    }

    public async listar(request: IListarRequest): Promise<IListarResponse> {
        let status = request.statusPedido;

        const queryBuilder = this.pedidoRepository.createQueryBuilder('item');

        if (status) {
          queryBuilder.where('item.status = :status', { status });
        }
    
        let pedidos = await queryBuilder.getMany();

        return {
            pedidos: pedidos
        }
    }

}