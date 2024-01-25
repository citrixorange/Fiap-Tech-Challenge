import { IItem } from "src/modulos/cardapio/core/domain/item.interface";

export enum StatusPedido {
    Recebido,
    EmPreparacao,
    Pronto,
    Finalizado
}

export interface IPedido {
    adicionarItem(item: IItem, quantidade: number);
    removerItem(item: IItem, quantidade: number);
    cpfNaNota(cof: string);
    protocolarPedido();
    atualizarStatus(status: StatusPedido);
}