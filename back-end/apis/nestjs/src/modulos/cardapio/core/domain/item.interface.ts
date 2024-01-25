import { Categoria } from "./categoria"

export interface IItem {
    nome: string,
    descricao: string,
    categoria: Categoria,
    preco: string
}