import { CardapioController } from "../src/modulos/cardapio/adapter/driver/api/cardapio.controller";
import { CardapioService } from "../src/modulos/cardapio/core/applications/services/cardapioService";
import { CardapioRepository } from "../src/modulos/cardapio/adapter/driven/db/typeorm/cardapio.repository";
import { QueryCardapioDto } from "../src/modulos/cardapio/adapter/driver/api/cardapio.dto";
import { EditarCardapioDto } from "../src/modulos/cardapio/adapter/driver/api/cardapio.dto";
import { Categoria } from "../src/modulos/cardapio/core/domain/categoria";

describe('CardapioController', () => {
  let cardapioController: CardapioController;
  let cardapioService: CardapioService;
  let cardapioRepository: CardapioRepository;

  beforeEach(() => {
    cardapioService = new CardapioService(cardapioRepository);
    cardapioController = new CardapioController(cardapioService);
  });

  it('Deve Listar os Itens do Cardápio', async () => {
    
    const result = [
        {
            nome: "produto-mock",
            descricao: "descrição-mock",
            categoria: "Acompanhamento",
            preco: "R$1.00"
        }
    ];

    const queryCardapioDto = new QueryCardapioDto();
    queryCardapioDto.nome = "produto";

    const editarCardapioDto = new EditarCardapioDto();
    editarCardapioDto.nome = "produto-mock";
    editarCardapioDto.descricao = "descrição-mock";
    editarCardapioDto.categoria = Categoria.Acompanhamento;
    editarCardapioDto.preco = "R$1.00";

    const spy_service = jest
      .spyOn(cardapioService, 'editarItem')
      .mockImplementation((): any => result);

    expect(await cardapioController.editar(queryCardapioDto, editarCardapioDto))
      .toEqual(result);

    expect(spy_service).toHaveBeenCalledTimes(1);
  });

});