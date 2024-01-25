import { Inject } from "@nestjs/common";
import { ICardapio } from "../ports/cardapio.interface";
import { Categoria } from "../../domain/categoria";
import { IItem } from "../../domain/item.interface";

export class CardapioService {
    constructor(
        @Inject('ICardapio')
        private readonly cardapioRepository: ICardapio
    ) {}

    async criarItem(nome:string, descricao: string, categoria: Categoria, preco: string) {
        return this.cardapioRepository.criarItem(nome, descricao, categoria, preco);
    }

    async editarItem(nome:string, novo_nome?: string, descricao?: string, categoria?: Categoria, preco?: string) {
        return await this.cardapioRepository.editarItem(nome, novo_nome, descricao, categoria, preco);
    }

    async removerItem(nome:string) {
        return this.cardapioRepository.removerItem(nome);
    }

    async listarItens(categoria?: Categoria): Promise<IItem[]> {
        return this.cardapioRepository.listarItens(categoria);
    }
}