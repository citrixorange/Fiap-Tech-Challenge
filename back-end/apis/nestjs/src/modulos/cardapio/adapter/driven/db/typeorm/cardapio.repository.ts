import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { ItemCardapio } from './cardapio.entity';
import { ICardapio } from "../../../../core/applications/ports/cardapio.interface";
import { Categoria } from "../../../../core/domain/categoria";
import { IItem } from "../../../../core/domain/item.interface";

@Injectable()
export class CardapioRepository implements ICardapio {

    constructor(
        @InjectRepository(ItemCardapio)
        private readonly cardapioRepository: Repository<ItemCardapio>,
    ) {}
    
    public async criarItem(nome:string, descricao: string, categoria: Categoria, preco: string) {
        let item = new ItemCardapio(
            nome,
            descricao,
            categoria, 
            preco
        );

        return await this.cardapioRepository.save(item);
    }

    public async editarItem(nome:string, novo_nome?: string, descricao?: string, categoria?: Categoria, preco?: string) {
        try {

            let patch = {};

            if (novo_nome) {
                patch["nome"] = novo_nome;
            }

            if (descricao) {
                patch["descricao"] = descricao;
            }

            if (categoria) {
                patch["categoria"] = categoria;
            }

            if (preco) {
                patch["preco"] = preco;
            }

            return await this.cardapioRepository
            .createQueryBuilder()
            .update(ItemCardapio)
            .set(patch)
            .where('nome = :nome', { nome })
            .execute();

        } catch (error) {
            throw new NotFoundException(`Item '${nome}' não encontrado no Cardápio`);
        }
    }

    public async removerItem(nome:string) {

        try {
            return await this.cardapioRepository
            .createQueryBuilder('item')
            .delete()
            .where('nome = :nome', { nome })
            .execute();
        } catch (error) {
            throw new NotFoundException(`Item '${nome}' não encontrado no Cardápio`);
        }

    }

    public async listarItens(categoria?: Categoria): Promise<IItem[]> {

        const queryBuilder = this.cardapioRepository.createQueryBuilder('item');

        if (categoria) {
          queryBuilder.where('item.categoria = :categoria', { categoria });
        }
    
        return await queryBuilder.getMany();
    }
}