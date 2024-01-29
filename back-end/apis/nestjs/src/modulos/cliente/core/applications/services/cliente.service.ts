import { Inject } from "@nestjs/common";
import { 
    ICadastroCliente,
    ICadastroRequest,
    ICadastroResponse,
    IIdentificacaoRequest,
    IIdentificacaoResponse
} from "../ports/cadastro.cliente.interface";

export class ClienteService {
    constructor(
        @Inject('ICadastroCliente')
        private readonly clienteRepository: ICadastroCliente
    ) {}

    async cadastrarCliente(request: ICadastroRequest): Promise<ICadastroResponse> {
        return this.clienteRepository.cadastro(request);
    }

    async identificarCliente(request: IIdentificacaoRequest): Promise<IIdentificacaoResponse> {
        return await this.clienteRepository.identificacao(request);
    }
}