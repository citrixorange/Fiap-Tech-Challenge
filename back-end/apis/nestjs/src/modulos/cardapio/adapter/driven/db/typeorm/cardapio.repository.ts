import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
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
import { config } from "../../../../../../config/global_config";

@Injectable()
export class CardapioRepository implements ICardapio {

    constructor(
        @InjectRepository(ItemCardapio)
        private readonly cardapioRepository: Repository<ItemCardapio>,
    ) {}
    
    public async criarItem(request: ICriarItemRequest): Promise<ICriarItemResponse> {

        try {
            let item = new ItemCardapio(
                request.nome,
                request.descricao,
                request.categoria, 
                request.preco
            );
    
            return {
                item: await this.cardapioRepository.save(item)
            };

        } catch(error) {
            console.log(error);
            throw new HttpException(
                {
                    status: HttpStatus.CONFLICT,
                    error: config["errors"]["messages"]["item_cardapio_duplicado"]
                },
                HttpStatus.CONFLICT
            );
        }
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

            console.log(error);

            if (error.code = 23505) {
                throw new HttpException(
                    {
                        status: HttpStatus.CONFLICT,
                        error: config["errors"]["messages"]["item_cardapio_duplicado"]
                    },
                    HttpStatus.CONFLICT
                );
            } else {
                throw new HttpException(
                    {
                      status: HttpStatus.NOT_FOUND,
                      error: config["errors"]["messages"]["item_cardapio_nao_encontrado"]
                    },
                    HttpStatus.NOT_FOUND
                );
            }
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
            throw new NotFoundException(config["errors"]["messages"]["item_cardapio_nao_encontrado"]);
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