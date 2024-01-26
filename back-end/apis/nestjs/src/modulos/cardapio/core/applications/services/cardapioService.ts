import { Inject } from "@nestjs/common";
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
} from "../ports/cardapio.interface";

export class CardapioService {
    constructor(
        @Inject('ICardapio')
        private readonly cardapioRepository: ICardapio
    ) {}

    async criarItem(request: ICriarItemRequest): Promise<ICriarItemResponse> {
        return await this.cardapioRepository.criarItem(request);
    }

    async editarItem(request: IEditarItemRequest): Promise<IEditarItemResponse> {
        return await this.cardapioRepository.editarItem(request);
    }

    async removerItem(request: IRemoverItemRequest): Promise<IRemoverItemResponse> {
        return await this.cardapioRepository.removerItem(request);
    }

    async listarItem(request: IListarItemRequest): Promise<IListarItemResponse> {
        return await this.cardapioRepository.listarItem(request);
    }
}