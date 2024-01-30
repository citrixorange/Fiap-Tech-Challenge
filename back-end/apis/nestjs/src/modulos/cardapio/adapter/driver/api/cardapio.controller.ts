import { Body, Controller, Get, Query, Post, Patch, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CardapioService } from '../../../core/applications/services/cardapioService';
import { 
  CreateCardapioDto, 
  EditarCardapioDto,
  ListarCardapioDto,
  QueryCardapioDto 
} from './cardapio.dto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('cardapio')
export class CardapioController {

  config: any;

  constructor(private readonly cardapioService: CardapioService) {
    const filePath = path.resolve(__dirname, '../../../../../config.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    this.config = JSON.parse(fileContent);
  }

  @Post()
  create(@Body() createCardapioDto: CreateCardapioDto) {
    return this.cardapioService.criarItem(
      {
        nome: createCardapioDto.nome,
        descricao: createCardapioDto.descricao,
        categoria: createCardapioDto.categoria,
        preco: createCardapioDto.preco
      }
    );
  }

  @Patch()
  async editar(
    @Query() queryCardapioDto: QueryCardapioDto,
    @Body() editarCardapioDto: EditarCardapioDto,
  ) {

    /*
      Tentei fazer essa validação pelos decorators do DTO mas não consegui. Caso alguém tenha uma idéia de como fazer
      por favor alterar. 
    */
    if (!editarCardapioDto.nome && !editarCardapioDto.descricao && !editarCardapioDto.categoria && !editarCardapioDto.preco) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: this.config["errors"]["messages"]["novo_campo_ausente"]
        },
        HttpStatus.BAD_REQUEST
      );
    }

    try {

      return await this.cardapioService.editarItem(
        {
          nome: queryCardapioDto.nome,
          novoNome: editarCardapioDto.nome,
          descricao: editarCardapioDto.descricao,
          categoria: editarCardapioDto.categoria,
          preco: editarCardapioDto.preco
        }
      );
    } catch(error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: this.config["errors"]["messages"]["item_cardapio_nao_encontrado"]
        },
        HttpStatus.NOT_FOUND
      );
    } 
  }

  @Get()
  async listar(
    @Query() query: ListarCardapioDto,
  ) {
    try{
      return await this.cardapioService.listarItem(
        {
          categoria: query.categoria
        }
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: this.config["errors"]["messages"]["item_cardapio_nao_encontrado"]
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Delete()
  async remover(
    @Query() queryCardapioDto: QueryCardapioDto,
  ) {
    try {
      return await this.cardapioService.removerItem({
        nome: queryCardapioDto.nome
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: this.config["errors"]["messages"]["item_cardapio_nao_encontrado"]
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

}
