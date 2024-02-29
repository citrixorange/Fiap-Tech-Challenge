import { Body, Controller, Get, Query, Post, Patch, HttpException, HttpStatus } from '@nestjs/common';

import { PedidoService } from '../../../core/applications/services/pedido.service';

import {
  RegistrarPedidoDto, 
  PatchPedidoDto, 
  ListarPedidoDto,
  AtualizarPagamentoDto 
} from './pedido.dto';

import { 
    IRegistarResponse,
    IIniciarPreparoResponse,
    ITerminarPreparoResponse,
    IFinalizarResponse,
    IAtualizarPagamentoResponse,
    IListarResponse
} from '../../../core/applications/ports/pedido.interface';

import { config } from "../../../../../config/global_config";

@Controller('pedido')
export class PedidoController {

  constructor(private readonly pedidoService: PedidoService) {}

  @Post('criar')
  async registrar(@Body() request: RegistrarPedidoDto): Promise<IRegistarResponse> {
    try {
      return await this.pedidoService.registrar(request);
    } catch(error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: config["errors"]["messages"]["bad_request"]
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
          error: config["errors"]["messages"]["bad_request"]
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
          error: config["errors"]["messages"]["bad_request"]
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
          error: config["errors"]["messages"]["bad_request"]
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Patch('atualizar-status-pagamento')
  async atualizarStatusPagamento(@Body() atualizarPagamentoDto: AtualizarPagamentoDto): Promise<IAtualizarPagamentoResponse> {
    try {
      return await this.pedidoService.atualizarStatusPagamento(atualizarPagamentoDto);
    } catch(error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: config["errors"]["messages"]["bad_request"]
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
          error: config["errors"]["messages"]["pedido_nao_encontrado"]
        },
        HttpStatus.NOT_FOUND
      );
    }
  }
}