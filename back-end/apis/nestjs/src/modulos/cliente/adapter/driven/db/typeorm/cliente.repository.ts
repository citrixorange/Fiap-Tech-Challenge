import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Cliente } from './cliente.entity';
import { 
    ICadastroCliente,
    ICadastroRequest,
    ICadastroResponse,
    IIdentificacaoRequest,
    IIdentificacaoResponse
} from '../../../../core/applications/ports/cadastro.cliente.interface';
import { config } from "../../../../../../config/global_config";

@Injectable()
export class ClienteRepository implements ICadastroCliente {

    constructor(
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
    ) {}

    public async cadastro(request: ICadastroRequest): Promise<ICadastroResponse> {

        try {
            let cliente = new Cliente(
                request.nome,
                request.cpf, 
                request.email
            );
            
            return {
                cliente: await this.clienteRepository.save(cliente)
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    status: HttpStatus.CONFLICT,
                    error: config["errors"]["messages"]["cliente_duplicado"]
                },
                HttpStatus.CONFLICT
            );
        }
        
    }

    public async identificacao(request: IIdentificacaoRequest): Promise<IIdentificacaoResponse> {
        
        try {
            const queryBuilder = this.clienteRepository.createQueryBuilder('cliente');

            if (request.nome) {
                let nome = request.nome;
              queryBuilder.andWhere('cliente.nome = :nome', { nome });
            }
    
            if (request.cpf) {
                let cpf = request.cpf;
                queryBuilder.andWhere('cliente.cpf = :cpf', { cpf });
            }
    
            if (request.email) {
                let email = request.email;
                queryBuilder.andWhere('cliente.email = :email', { email });
            }
    
            let obj = await queryBuilder.getOneOrFail();

            return {
                cliente: obj
            };

        } catch (error) {
            throw new NotFoundException(config["errors"]["messages"]["cliente_nao_encontrado"]);
        }

    }
    
}