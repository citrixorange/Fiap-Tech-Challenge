import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { PedidoProtocolado, ItemPedido } from './pedido.entity';
import { Cliente } from '../../../../../cliente/adapter/driven/db/typeorm/cliente.entity';
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
import { StatusPedido } from 'protobuf/gen/pedido/def/pedido';

@Injectable()
export class PedidoRepository implements IRegistroPedido {

    constructor(
        @InjectRepository(PedidoProtocolado)
        private readonly pedidoRepository: Repository<PedidoProtocolado>,

        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,

        @InjectRepository(ItemCardapio)
        private readonly cardapioRepository: Repository<ItemCardapio>,

        //private cardapioCache: Map<string, ItemCardapio>,

    ) {}

    private async getItemCardapioByNome(nome: string): Promise<ItemCardapio | undefined> {
        
        /*if(!this.cardapioCache.has(nome)) {
            
            const item = await this.cardapioRepository.findOne({
                where: { nome }
            });
            
            this.cardapioCache.set(nome, item);
        }

        return this.cardapioCache.get(nome);*/

        const item = await this.cardapioRepository.findOne({
            where: { nome }
        });

        return item;
    }

    public async registrar(request: IRegistarRequest): Promise<IRegistarResponse> {
        try {

            let object = JSON.parse(JSON.stringify(request.pedido));

            let cpfCliente = object.customer.tax_id;

            let pedido: ItemPedido[] = [];

            for(const itemPedido of object.items) {
                let itemCardapio = await this.getItemCardapioByNome(itemPedido.name);

                if(!itemCardapio) {
                    throw new Error(`ItemCardapio with nome '${itemPedido.name}' not found.`);
                }

                let item = new ItemPedido(itemPedido.quantity, itemCardapio, object.created_at);
                pedido.push(item);
            }

            let cliente = await this.clienteRepository.findOne({
                where: { cpf: cpfCliente }
            });

            if(!cliente) {
                cliente = new Cliente(
                    object.customer.name, 
                    object.customer.tax_id,
                    object.customer.email
                );
            }



            let pedidoProtocolo = new PedidoProtocolado(object.reference_id, cliente, pedido, object.created_at);

            console.log(JSON.stringify(pedidoProtocolo));

            let protocol = await this.pedidoRepository.save(pedidoProtocolo);

            return {
                protocolo: protocol
            };

        } catch(error) {
            console.log(error);
            throw error;
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
                throw new Error(`Pedido '${request.id}' not found.`);
            }

            pedido.receivedAt = new Date();
            pedido.status = StatusPedido.PREPARANDO;

            pedido = await this.pedidoRepository.save(pedido);

            return {
                protocolo: pedido
            };

        } catch(error) {
            console.log(error);
            return error;
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
                throw new Error(`Pedido '${request.id}' not found.`);
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
                throw new Error(`Pedido '${request.id}' not found.`);
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