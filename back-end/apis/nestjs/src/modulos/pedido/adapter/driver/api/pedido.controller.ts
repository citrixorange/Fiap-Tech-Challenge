import { Body, Controller, Get, Query, Post, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { PedidoService } from '../../../core/applications/services/pedido.service';
import { PatchPedidoDto, ListarPedidoDto } from './pedido.dto';
import { 
    IRegistarResponse,
    IIniciarPreparoResponse,
    ITerminarPreparoResponse,
    IFinalizarResponse,
    IListarResponse
} from '../../../core/applications/ports/pedido.interface';

import * as fs from 'fs';
import * as path from 'path';

@Controller('pedido')
export class PedidoController {

  config: any;

  constructor(private readonly pedidoService: PedidoService) {
    const filePath = path.resolve(__dirname, '../../../../../config.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    this.config = JSON.parse(fileContent);
  }

  @Post('criar')
  async registrar(@Body() request: any): Promise<IRegistarResponse> {
    try {
      return await this.pedidoService.registrar({
        pedido: request
      });
    } catch(error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: this.config["errors"]["messages"]["bad_request"]
        },
        HttpStatus.BAD_REQUEST
      );
    };

  }

  @Patch('iniciar')
  async iniciarPreparo(@Body() patchPedidoDto: PatchPedidoDto): Promise<IIniciarPreparoResponse> {
    try {
      return await this.pedidoService.iniciarPreparo(patchPedidoDto);
    } catch(error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: this.config["errors"]["messages"]["bad_request"]
        },
        HttpStatus.BAD_REQUEST
      );
    }
    
  }

  @Patch('terminar')
  async terminarPreparo(@Body() patchPedidoDto: PatchPedidoDto): Promise<ITerminarPreparoResponse> {
    try {
      return await this.pedidoService.terminarPreparo(patchPedidoDto);
    } catch(error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: this.config["errors"]["messages"]["bad_request"]
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Patch('finalizar')
  async finalizar(@Body() patchPedidoDto: PatchPedidoDto): Promise<IFinalizarResponse> {
    try {
      return await this.pedidoService.finalizar(patchPedidoDto);
    } catch(error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: this.config["errors"]["messages"]["bad_request"]
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async listar(
    @Query() query: ListarPedidoDto,
  ): Promise<IListarResponse> 
  {
    try{
      return await this.pedidoService.listar( query.status ? { statusPedido: query.status } : {} );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: this.config["errors"]["messages"]["pedido_nao_encontrado"]
        },
        HttpStatus.NOT_FOUND
      );
    }
  }
}