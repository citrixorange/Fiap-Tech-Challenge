import { Body, Controller, Get, Query, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ClienteService } from '../../../core/applications/services/cliente.service';
import { CadastrarClienteDto, IdentificarClienteDto } from './cliente.dto';
import { 
  ICadastroResponse,
  IIdentificacaoResponse
} from '../../../core/applications/ports/cadastro.cliente.interface';
import { config } from "../../../../../config/global_config";

@Controller('cliente')
export class ClienteController {

  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async cadastrar(@Body() clienteDto: CadastrarClienteDto): Promise<ICadastroResponse> {

    try {
      return await this.clienteService.cadastrarCliente(
        {
          nome: clienteDto.nome,
          cpf: clienteDto.cpf,
          email: clienteDto.email
        }
      );
    } catch(error) {
      throw error;
    }
  }

  @Get()
  async identificar(
    @Query() query: IdentificarClienteDto,
  ): Promise<IIdentificacaoResponse> {

    /*
      Tentei fazer essa validação pelos decorators do DTO mas não consegui. Caso alguém tenha uma idéia de como fazer
      por favor alterar. 
    */
    if (!query.nome && !query.cpf && !query.email) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: config["errors"]["messages"]["identificador_ausente"]
        },
        HttpStatus.BAD_REQUEST
      );
    }

    try {

      return await this.clienteService.identificarCliente(
          {
            nome: query.nome,
            cpf: query.cpf,
            email: query.email
          }
      );
      
    } catch(error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: config["errors"]["messages"]["cliente_nao_encontrado"]
        },
        HttpStatus.NOT_FOUND
      );
    } 
  }
};