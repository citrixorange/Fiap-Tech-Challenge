import { Categoria } from "../../domain/categoria";
import { IItem } from "../../domain/item.interface";

export interface ICardapio {
    criarItem(nome:string, descricao: string, categoria: Categoria, preco: string);
    editarItem(nome:string, novo_nome?: string, descricao?: string, categoria?: Categoria, preco?: string);
    removerItem(nome:string);
    listarItens(categoria?: Categoria): Promise<IItem[]>;
}