import { Injectable, NotFoundException } from '@nestjs/common';
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
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ClienteRepository implements ICadastroCliente {

    config: any;

    constructor(
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
    ) {
        const filePath = path.resolve(__dirname, '../../../../../../config.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        this.config = JSON.parse(fileContent);
    }

    public async cadastro(request: ICadastroRequest): Promise<ICadastroResponse> {
        let cliente = new Cliente(
            request.nome,
            request.cpf, 
            request.email
        );
        
        return {
            cliente: await this.clienteRepository.save(cliente)
        };
        
    }

    public async identificacao(request: IIdentificacaoRequest): Promise<IIdentificacaoResponse> {
        
        try {
            const queryBuilder = this.clienteRepository.createQueryBuilder('cliente');

            if (request.nome) {
                let nome = request.nome;
              queryBuilder.where('cliente.nome = :nome', { nome });
            }
    
            if (request.cpf) {
                let cpf = request.cpf;
                queryBuilder.where('cliente.cpf = :cpf', { cpf });
            }
    
            if (request.email) {
                let email = request.email;
                queryBuilder.where('cliente.email = :email', { email });
            }
    
            let obj = await queryBuilder.getOneOrFail();

            return {
                cliente: obj
            };

        } catch (error) {
            throw new NotFoundException(this.config["errors"]["messages"]["cliente_nao_encontrado"]);
        }

    }
    
}