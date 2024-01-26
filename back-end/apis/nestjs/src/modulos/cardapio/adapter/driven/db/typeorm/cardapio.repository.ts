import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { ItemCardapio } from './cardapio.entity';
import { 
    ICardapio,
    ICriarItemRequest,
    ICriarItemResponse,
    IEditarItemRequest,
    IEditarItemResponse,
    IRemoverItemRequest,
    IRemoverItemResponse,
    IListarItemRequest,
    IListarItemResponse
} from "../../../../core/applications/ports/cardapio.interface";

@Injectable()
export class CardapioRepository implements ICardapio {

    constructor(
        @InjectRepository(ItemCardapio)
        private readonly cardapioRepository: Repository<ItemCardapio>,
    ) {}
    
    public async criarItem(request: ICriarItemRequest): Promise<ICriarItemResponse> {
        
        let item = new ItemCardapio(
            request.nome,
            request.descricao,
            request.categoria, 
            request.preco
        );

        return {
            item: await this.cardapioRepository.save(item)
        };
    }

    public async editarItem(request: IEditarItemRequest): Promise<IEditarItemResponse> {
        
        let nome = request.nome;

        try {
            let patch = {};

            if (request.novoNome) {
                patch["nome"] = request.novoNome;
            }

            if (request.descricao) {
                patch["descricao"] = request.descricao;
            }

            if (request.categoria) {
                patch["categoria"] = request.categoria;
            }

            if (request.preco) {
                patch["preco"] = request.preco;
            }

            let item  = await this.cardapioRepository
                .createQueryBuilder()
                .update(ItemCardapio)
                .set(patch)
                .where('nome = :nome', { nome })
                .returning('*')
                .execute();

            return {
                item: item.raw[0]
            };

        } catch (error) {
            throw new NotFoundException(`Item '${nome}' não encontrado no Cardápio`);
        }
    }

    public async removerItem(request: IRemoverItemRequest): Promise<IRemoverItemResponse> {

        let nome = request.nome;

        try {
            let item = await this.cardapioRepository
                .createQueryBuilder('item')
                .delete()
                .where('nome = :nome', { nome })
                .returning('*')
                .execute();

            return {
                item: item.raw[0]
            };

        } catch (error) {
            throw new NotFoundException(`Item '${nome}' não encontrado no Cardápio`);
        }

    }

    public async listarItem(request: IListarItemRequest): Promise<IListarItemResponse> {

        let categoria = request.categoria;

        const queryBuilder = this.cardapioRepository.createQueryBuilder('item');

        if (categoria) {
          queryBuilder.where('item.categoria = :categoria', { categoria });
        }
    
        let itens = await queryBuilder.getMany();

        return {
            item: itens
        }
    }
}