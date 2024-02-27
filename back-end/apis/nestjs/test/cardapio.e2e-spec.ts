import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { Connection } from "typeorm";
import { AppModule } from "../src/app.module";
import { loadFixtures as loadFixturesBase } from "./utils";
import { Categoria } from "../src/modulos/cardapio/core/domain/categoria";
import { config } from "../src/config/global_config";
import { testHttpStatusCodes } from "../src/errors/handler";
import { StatusPedido } from "../src/modulos/pedido/core/domain/item.pedido.interface";

let app: INestApplication;
let mod: TestingModule;
let connection: Connection;

const loadFixtures = async (sqlFileName: string) => loadFixturesBase(connection, sqlFileName);

describe('Cardapio (e2e)', () => {

    let testNo = 1;

    beforeEach( async () => {
        mod = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
      
        app = mod.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
    
        await app.init();

        connection = app.get(Connection);
    });

    afterEach( async () => {
        await app.close();
    });

    function criarPedidoBody(
        reference_id: string,
        items: any[],
        cliente: any
    ) {
        return {
            "id": "ORDE_3B5AE8B2-C41A-4C75-BD2B-9999BAC3F9BE",
            "reference_id": reference_id,
            "created_at": "2020-11-21T23:23:22.69-03:00",
            "shipping": {
                "address": {
                    "street": "Avenida Brigadeiro Faria Lima",
                    "number": "1384",
                    "complement": "apto 12",
                    "locality": "Pinheiros",
                    "city": "São Paulo",
                    "region_code": "SP",
                    "country": "BRA",
                    "postal_code": "01452002"
                }
            },
            "items": items,
            "customer": {
                "name": cliente.nome,
                "email": cliente.email,
                "tax_id": cliente.cpf,
                "phones": [
                    {
                        "country": "55",
                        "area": "11",
                        "number": "999999999",
                        "type": "MOBILE"
                    }
                ]
            },
            "charges": [
                {
                    "id": "CHAR_F1F10115-09F4-4560-85F5-A828D9F96300",
                    "reference_id": "referencia da cobranca",
                    "status": "PAID",
                    "created_at": "2020-11-21T23:30:22.695-03:00",
                    "paid_at": "2020-11-21T23:30:24.352-03:00",
                    "description": "descricao da cobranca",
                    "amount": {
                        "value": 100,
                        "currency": "BRL",
                        "summary": {
                            "total": 100,
                            "paid": 100,
                            "refunded": 0
                        }
                    },
                    "payment_response": {
                        "code": "20000",
                        "message": "SUCESSO",
                        "reference": "1606012224352"
                    },
                    "payment_method": {
                        "type": "PIX",
                        "holder": {
                                "name": "Francisco da Silva",
                                "tax_id": "***534218**"
                        }
                    },
                    "links": [
                        {
                            "rel": "SELF",
                            "href": "https://sandbox.api.pagseguro.com/charges/CHAR_F1F10115-09F4-4560-85F5-A828D9F96300",
                            "media": "application/json",
                            "type": "GET"
                        },
                        {
                            "rel": "CHARGE.CANCEL",
                            "href": "https://sandbox.api.pagseguro.com/charges/CHAR_F1F10115-09F4-4560-85F5-A828D9F96300/cancel",
                            "media": "application/json",
                            "type": "POST"
                        }
                    ]
                }
            ],
            "qr_code": [
                {
                    "id": "QRCO_86FE511B-E945-4FE1-BB5D-297974C0DB74",
                    "amount": {
                        "value": 1
                    },
                    "text": "00020101021226600016BR.COM.PAGSEGURO013686FE511B-E945-4FE1-BB5D-297974C0DB7452048999530398654045.005802BR5922Rafael Gouveia Firmino6009SAO PAULO63049879",
                    "links": [
                        {
                            "rel": "QRCODE.PNG",
                            "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_86FE511B-E945-4FE1-BB5D-297974C0DB74/png",
                            "media": "image/png",
                            "type": "GET"
                        },
                        {
                            "rel": "QRCODE.BASE64",
                            "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_86FE511B-E945-4FE1-BB5D-297974C0DB74/base64",
                            "media": "text/plain",
                            "type": "GET"
                        }
                    ]
                }
            ],
            "links": [
                {
                    "rel": "SELF",
                    "href": "https://sandbox.api.pagseguro.com/orders/ORDE_F87334AC-BB8B-42E2-AA85-8579F70AA328",
                    "media": "application/json",
                    "type": "GET"
                },
                {
                    "rel": "PAY",
                    "href": "https://sandbox.api.pagseguro.com/orders/ORDE_F87334AC-BB8B-42E2-AA85-8579F70AA328/pay",
                    "media": "application/json",
                    "type": "POST"
                }
            ]
        };
    }

    it(`${testNo} - Deve criar um novo Item para o Cardapio.`, async () => {
        return request(app.getHttpServer())
            .post('/cardapio')
            .send({
                nome: "item_teste",
                descricao: "descricao_teste",
                categoria: Categoria.LANCHE,
                preco: "R$1.00"
            })
            .expect(201)
            .then(response => {
                expect(response.body.item.nome).toBe("item_teste");
                expect(response.body.item.descricao).toBe("descricao_teste");
                expect(response.body.item.categoria).toBe(Categoria.LANCHE);
                expect(response.body.item.preco).toBe("R$1.00");
            });
    });

    testNo++;

    it(`${testNo} - Deve editar um Item para o Cardapio.`, async () => {

        await loadFixtures('2-cardapio.sql');

        return request(app.getHttpServer())
        .patch('/cardapio')
        .query({
            nome: "item_teste"
        })
        .send({
            descricao: "nova_descricao_teste"
        })
        .expect(200)
        .then( _ => {
            return request(app.getHttpServer())
            .get('/cardapio')
            .expect(200)
            .then(response => {
                expect(response.body.item[0].nome).toBe("item_teste");
                expect(response.body.item[0].descricao).toBe("nova_descricao_teste");
                expect(response.body.item[0].categoria).toBe(Categoria.LANCHE);
                expect(response.body.item[0].preco).toBe("R$1.00");
            });
        });
    });

    testNo++;

    it(`${testNo} - Deve remover o Item do Cardapio.`, async () => {

        await loadFixtures('2-cardapio.sql');

        return request(app.getHttpServer())
        .delete('/cardapio')
        .query({
            nome: "item_teste"
        })
        .expect(200)
        .then( _ => {
            return request(app.getHttpServer())
            .get('/cardapio')
            .expect(200)
            .then(response => {
                expect(response.body.item).toEqual([]);
            });
        });
    });

    testNo++;

    it(`${testNo} - Deve listar todos os Itens do Cardapio.`, async () => {

        await loadFixtures('4-cardapio.sql');

        return request(app.getHttpServer())
        .get('/cardapio')
        .expect(200)
        .then(response => {
            expect(response.body.item.length).toBe(4);

            expect(response.body.item[0].nome).toBe("item_teste1");
            expect(response.body.item[0].descricao).toBe("descricao_teste1");
            expect(response.body.item[0].categoria).toBe(Categoria.LANCHE);
            expect(response.body.item[0].preco).toBe("R$1.00");

            expect(response.body.item[1].nome).toBe("item_teste2");
            expect(response.body.item[1].descricao).toBe("descricao_teste2");
            expect(response.body.item[1].categoria).toBe(Categoria.ACOMPANHAMENTO);
            expect(response.body.item[1].preco).toBe("R$1.00");

            expect(response.body.item[2].nome).toBe("item_teste3");
            expect(response.body.item[2].descricao).toBe("descricao_teste3");
            expect(response.body.item[2].categoria).toBe(Categoria.BEBIDA);
            expect(response.body.item[2].preco).toBe("R$1.00");

            expect(response.body.item[3].nome).toBe("item_teste4");
            expect(response.body.item[3].descricao).toBe("descricao_teste4");
            expect(response.body.item[3].categoria).toBe(Categoria.SOBREMESA);
            expect(response.body.item[3].preco).toBe("R$1.00");
        });
    });

    testNo++;

    it(`${testNo} - Deve listar todos os Itens de uma Categoria do Cardapio.`, async () => {

        await loadFixtures('5-cardapio.sql');

        return request(app.getHttpServer())
        .get('/cardapio')
        .query({
            categoria: Categoria.LANCHE
        })
        .expect(200)
        .then(response => {
            expect(response.body.item.length).toBe(2);

            expect(response.body.item[0].nome).toBe("item_teste1");
            expect(response.body.item[0].descricao).toBe("descricao_teste1");
            expect(response.body.item[0].categoria).toBe(Categoria.LANCHE);
            expect(response.body.item[0].preco).toBe("R$1.00");

            expect(response.body.item[1].nome).toBe("item_teste2");
            expect(response.body.item[1].descricao).toBe("descricao_teste2");
            expect(response.body.item[1].categoria).toBe(Categoria.LANCHE);
            expect(response.body.item[1].preco).toBe("R$1.00");
        });
    });

    testNo++;

    it(`${testNo} - Criação de um Item no Cardápio com Nome Duplicado dever ser rejeitada.`, async () => {
        await loadFixtures('2-cardapio.sql');
        
        return request(app.getHttpServer())
        .post('/cardapio')
        .send({
            nome: "item_teste",
            descricao: "descricao_teste",
            categoria: Categoria.LANCHE,
            preco: "R$1.00"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["item_cardapio_duplicado"]))
        .then(response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["item_cardapio_duplicado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["item_cardapio_duplicado"]);
        });
        
    });

    testNo++;


    it(`${testNo} - Criação de um Item no Cardápio com Categoria Inválida dever ser rejeitada.`, async () => {
        return request(app.getHttpServer())
        .post('/cardapio')
        .send({
            nome: "item_teste",
            descricao: "descricao_teste",
            categoria: 7,
            preco: "R$1.00"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["categoria_invalida"]))
        .then(response => {
            expect(response.body.statusCode).toBe(testHttpStatusCodes(config["errors"]["status_code"]["categoria_invalida"]));
            expect(response.body.message[0]).toBe(config["errors"]["messages"]["categoria_invalida"]);
        });
    });

    testNo++;

    it(`${testNo} - Edição de um Item no Cardápio com Nome Duplicado dever ser rejeitada.`, async () => {
        await loadFixtures('4-cardapio.sql');

        return request(app.getHttpServer())
        .patch('/cardapio')
        .query({
            nome: "item_teste1"
        })
        .send({
            nome: "item_teste2"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["item_cardapio_duplicado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["item_cardapio_duplicado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["item_cardapio_duplicado"]);
        });
    });

    testNo++;

    it(`${testNo} - Edição de um Item no Cardápio com Categoria Inválida dever ser rejeitada.`, async () => {
        await loadFixtures('4-cardapio.sql');

        return request(app.getHttpServer())
        .patch('/cardapio')
        .query({
            nome: "item_teste1"
        })
        .send({
            categoria: "A"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["categoria_invalida"]))
        .then( response => {
            expect(response.body.statusCode).toBe(testHttpStatusCodes(config["errors"]["status_code"]["categoria_invalida"]));
            expect(response.body.message[0]).toBe(config["errors"]["messages"]["categoria_invalida"]);
        });
    });

    testNo++;

    it(`${testNo} - Cadastro de um Novo Cliente deve ser aceito.`, async () => {
        return request(app.getHttpServer())
            .post('/cliente')
            .send({
                nome: "João Silva de Machado",
                cpf: "11122233344",
                email: "joaodasilva@mail.com"
            })
            .expect(201)
            .then(response => {
                expect(response.body.cliente.nome).toBe("João Silva de Machado");
                expect(response.body.cliente.cpf).toBe("11122233344");
                expect(response.body.cliente.email).toBe("joaodasilva@mail.com");
            });
    });

    testNo++;

    it(`${testNo} - Cadastro duplicado do campo nome do Cliente deve ser rejeitado.`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .post('/cliente')
        .send({
            nome: "Joao da Silva",
            cpf: "55577788899",
            email: "test@mail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_duplicado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_duplicado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_duplicado"]);
        });
    });

    testNo++;

    it(`${testNo} - Cadastro duplicado do campo cpf do Cliente deve ser rejeitado.`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .post('/cliente')
        .send({
            nome: "Test",
            cpf: "11122233344",
            email: "test@mail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_duplicado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_duplicado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_duplicado"]);
        });
    });

    testNo++;

    it(`${testNo} - Cadastro duplicado do campo email do Cliente deve ser rejeitado.`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .post('/cliente')
        .send({
            nome: "Test",
            cpf: "55577788899",
            email: "joao@mail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_duplicado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_duplicado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_duplicado"]);
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome deve ser aceito`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Joao da Silva"
        })
        .expect(200)
        .then(response => {
            expect(response.body.cliente.nome).toBe("Joao da Silva");
            expect(response.body.cliente.cpf).toBe("11122233344");
            expect(response.body.cliente.email).toBe("joao@mail.com");
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por email deve ser aceito`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            email: "joao@mail.com"
        })
        .expect(200)
        .then(response => {
            expect(response.body.cliente.nome).toBe("Joao da Silva");
            expect(response.body.cliente.cpf).toBe("11122233344");
            expect(response.body.cliente.email).toBe("joao@mail.com");
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por cpf deve ser aceito`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            cpf: "11122233344"
        })
        .expect(200)
        .then(response => {
            expect(response.body.cliente.nome).toBe("Joao da Silva");
            expect(response.body.cliente.cpf).toBe("11122233344");
            expect(response.body.cliente.email).toBe("joao@mail.com");
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome e cpf deve ser aceito`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Joao da Silva",
            cpf: "11122233344"
        })
        .expect(200)
        .then(response => {
            expect(response.body.cliente.nome).toBe("Joao da Silva");
            expect(response.body.cliente.cpf).toBe("11122233344");
            expect(response.body.cliente.email).toBe("joao@mail.com");
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome e email deve ser aceito`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Joao da Silva",
            email: "joao@mail.com"
        })
        .expect(200)
        .then(response => {
            expect(response.body.cliente.nome).toBe("Joao da Silva");
            expect(response.body.cliente.cpf).toBe("11122233344");
            expect(response.body.cliente.email).toBe("joao@mail.com");
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por cpf e email deve ser aceito`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            cpf: "11122233344",
            email: "joao@mail.com"
        })
        .expect(200)
        .then(response => {
            expect(response.body.cliente.nome).toBe("Joao da Silva");
            expect(response.body.cliente.cpf).toBe("11122233344");
            expect(response.body.cliente.email).toBe("joao@mail.com");
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome, cpf e email deve ser aceito`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Joao da Silva",
            cpf: "11122233344",
            email: "joao@mail.com"
        })
        .expect(200)
        .then(response => {
            expect(response.body.cliente.nome).toBe("Joao da Silva");
            expect(response.body.cliente.cpf).toBe("11122233344");
            expect(response.body.cliente.email).toBe("joao@mail.com");
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome e cpf conflitantes deve ser rejeitado`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Pedro",
            cpf: "11122233344"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_nao_encontrado"]);
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome e email conflitantes deve ser rejeitado`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Joao da Silva",
            email: "test@gmail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_nao_encontrado"]);
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por cpf e email conflitantes deve ser rejeitado`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            cpf: "55577788899",
            email: "joao@mail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_nao_encontrado"]);
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome(conflitante), cpf e email conflitantes deve ser rejeitado`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Pedro",
            cpf: "11122233344",
            email: "joao@mail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_nao_encontrado"]);
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome, cpf(conflitante) e email conflitantes deve ser rejeitado`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Joao da Silva",
            cpf: "22233344455",
            email: "joao@mail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_nao_encontrado"]);
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome, cpf e email(conflitante) conflitantes deve ser rejeitado`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Joao da Silva",
            cpf: "11122233344",
            email: "test@mail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_nao_encontrado"]);
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome, cpf(conflitante) e email(conflitante) conflitantes deve ser rejeitado`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Joao da Silva",
            cpf: "22233344455",
            email: "test@mail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_nao_encontrado"]);
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome(conflitante), cpf e email(conflitante) conflitantes deve ser rejeitado`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Carlos",
            cpf: "11122233344",
            email: "test@mail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_nao_encontrado"]);
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome(conflitante), cpf(conflitante) e email conflitantes deve ser rejeitado`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Carlos",
            cpf: "22233344455",
            email: "joao@mail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_nao_encontrado"]);
        });
    });

    testNo++;

    it(`${testNo} - Identificação do cliente por nome(conflitante), cpf(conflitante) e email(conflitante) conflitantes deve ser rejeitado`, async () => {
        await loadFixtures('2-cliente.sql');

        return request(app.getHttpServer())
        .get('/cliente')
        .query({
            nome: "Carlos",
            cpf: "22233344455",
            email: "test@mail.com"
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]))
        .then( response => {
            expect(response.body.status).toBe(testHttpStatusCodes(config["errors"]["status_code"]["cliente_nao_encontrado"]));
            expect(response.body.error).toBe(config["errors"]["messages"]["cliente_nao_encontrado"]);
        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente válido, pedido de um único item válido com quantidade unitária deve funcionar com sucesso.`, async () => {
        await loadFixtures('2-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste",
                            "quantidade": 1,
                            "preco": "R$1.00"
                        }
                    ]
                },
                "cliente": {
                    "nome": "Jose da Silva",
                    "cpf": "12345678909",
                    "email": "email@test.com"
                }
            }
        })
        .expect(201)
        .then( response => {
            expect(response.body.qrCodeId.length).toBeGreaterThan(0);
            expect(response.body.pedido[0].nome).toBe("item_teste");
            expect(response.body.pedido[0].quantidade).toBe(1);
            expect(response.body.pedido[0].preco).toBe("R$1.00");
            expect(response.body.totalAmount).toBe(100);
            expect(response.body.qrCodeText.length).toBeGreaterThan(0);
            expect(response.body.qrCodeBase64Link).not.toBeUndefined();
            expect(response.body.qrCodeBase64Link).not.toBeNull();
            expect(response.body.qrCodePngLink).not.toBeUndefined();
            expect(response.body.qrCodePngLink).not.toBeNull();

        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente válido, pedido de três itens válidos com quantidades unitárias deve funcionar com sucesso.`, async () => {
        await loadFixtures('3-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste1",
                            "quantidade": 1,
                            "preco": "R$5.07"
                        },
                        {
                            "nome": "item_teste2",
                            "quantidade": 1,
                            "preco": "R$9.86"
                        },
                        {
                            "nome": "item_teste3",
                            "quantidade": 1,
                            "preco": "R$0.01"
                        }
                    ]
                },
                "cliente": {
                    "nome": "Jose da Silva",
                    "cpf": "12345678909",
                    "email": "email@test.com"
                }
            }
        })
        .expect(201)
        .then( response => {
            expect(response.body.qrCodeId.length).toBeGreaterThan(0);
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste1",
                "quantidade": 1,
                "preco": "R$5.07"
            });
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste2",
                "quantidade": 1,
                "preco": "R$9.86"
            });
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste3",
                "quantidade": 1,
                "preco": "R$0.01"
            });
            expect(response.body.totalAmount).toBe(1494);
            expect(response.body.qrCodeText.length).toBeGreaterThan(0);
            expect(response.body.qrCodeBase64Link).not.toBeUndefined();
            expect(response.body.qrCodeBase64Link).not.toBeNull();
            expect(response.body.qrCodePngLink).not.toBeUndefined();
            expect(response.body.qrCodePngLink).not.toBeNull();

        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente anônimo, pedido de um único item válido com quantidade unitária deve funcionar com sucesso.`, async () => {
        await loadFixtures('2-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste",
                            "quantidade": 1,
                            "preco": "R$1.00"
                        }
                    ]
                }
            }
        })
        .expect(201)
        .then( response => {
            expect(response.body.qrCodeId.length).toBeGreaterThan(0);
            expect(response.body.pedido[0].nome).toBe("item_teste");
            expect(response.body.pedido[0].quantidade).toBe(1);
            expect(response.body.pedido[0].preco).toBe("R$1.00");
            expect(response.body.totalAmount).toBe(100);
            expect(response.body.qrCodeText.length).toBeGreaterThan(0);
            expect(response.body.qrCodeBase64Link).not.toBeUndefined();
            expect(response.body.qrCodeBase64Link).not.toBeNull();
            expect(response.body.qrCodePngLink).not.toBeUndefined();
            expect(response.body.qrCodePngLink).not.toBeNull();

        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente anônimo, pedido de quatro itens válidos com quantidades unitárias deve funcionar com sucesso.`, async () => {
        await loadFixtures('4-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste1",
                            "quantidade": 1,
                            "preco": "R$5.07"
                        },
                        {
                            "nome": "item_teste2",
                            "quantidade": 1,
                            "preco": "R$9.86"
                        },
                        {
                            "nome": "item_teste3",
                            "quantidade": 1,
                            "preco": "R$0.01"
                        },
                        {
                            "nome": "item_teste4",
                            "quantidade": 1,
                            "preco": "R$2.23"
                        }
                    ]
                }
            }
        })
        .expect(201)
        .then( response => {
            expect(response.body.qrCodeId.length).toBeGreaterThan(0);
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste1",
                "quantidade": 1,
                "preco": "R$5.07"
            });
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste2",
                "quantidade": 1,
                "preco": "R$9.86"
            });
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste3",
                "quantidade": 1,
                "preco": "R$0.01"
            });
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste4",
                "quantidade": 1,
                "preco": "R$2.23"
            });
            expect(response.body.totalAmount).toBe(1717);
            expect(response.body.qrCodeText.length).toBeGreaterThan(0);
            expect(response.body.qrCodeBase64Link).not.toBeUndefined();
            expect(response.body.qrCodeBase64Link).not.toBeNull();
            expect(response.body.qrCodePngLink).not.toBeUndefined();
            expect(response.body.qrCodePngLink).not.toBeNull();

        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente válido, pedido de um único item válido com quantidade igual a 3 deve funcionar com sucesso.`, async () => {
        await loadFixtures('2-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste",
                            "quantidade": 3,
                            "preco": "R$1.00"
                        }
                    ]
                },
                "cliente": {
                    "nome": "Jose da Silva",
                    "cpf": "12345678909",
                    "email": "email@test.com"
                }
            }
        })
        .expect(201)
        .then( response => {
            expect(response.body.qrCodeId.length).toBeGreaterThan(0);
            expect(response.body.pedido[0].nome).toBe("item_teste");
            expect(response.body.pedido[0].quantidade).toBe(3);
            expect(response.body.pedido[0].preco).toBe("R$1.00");
            expect(response.body.totalAmount).toBe(300);
            expect(response.body.qrCodeText.length).toBeGreaterThan(0);
            expect(response.body.qrCodeBase64Link).not.toBeUndefined();
            expect(response.body.qrCodeBase64Link).not.toBeNull();
            expect(response.body.qrCodePngLink).not.toBeUndefined();
            expect(response.body.qrCodePngLink).not.toBeNull();

        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente válido, pedido de três itens válidos com quantidades 1, 2 e 3 respectivamente deve funcionar com sucesso.`, async () => {
        await loadFixtures('3-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste1",
                            "quantidade": 1,
                            "preco": "R$5.07"
                        },
                        {
                            "nome": "item_teste2",
                            "quantidade": 2,
                            "preco": "R$9.86"
                        },
                        {
                            "nome": "item_teste3",
                            "quantidade": 3,
                            "preco": "R$0.01"
                        }
                    ]
                },
                "cliente": {
                    "nome": "Jose da Silva",
                    "cpf": "12345678909",
                    "email": "email@test.com"
                }
            }
        })
        .expect(201)
        .then( response => {
            expect(response.body.qrCodeId.length).toBeGreaterThan(0);
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste1",
                "quantidade": 1,
                "preco": "R$5.07"
            });
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste2",
                "quantidade": 2,
                "preco": "R$9.86"
            });
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste3",
                "quantidade": 3,
                "preco": "R$0.01"
            });
            expect(response.body.totalAmount).toBe(2482);
            expect(response.body.qrCodeText.length).toBeGreaterThan(0);
            expect(response.body.qrCodeBase64Link).not.toBeUndefined();
            expect(response.body.qrCodeBase64Link).not.toBeNull();
            expect(response.body.qrCodePngLink).not.toBeUndefined();
            expect(response.body.qrCodePngLink).not.toBeNull();

        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente anônimo, pedido de um único item válido com quantidade 10 deve funcionar com sucesso.`, async () => {
        await loadFixtures('2-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste1",
                            "quantidade": 10,
                            "preco": "R$5.07"
                        }
                    ]
                },
                "cliente": {
                    "nome": "Jose da Silva",
                    "cpf": "12345678909",
                    "email": "email@test.com"
                }
            }
        })
        .expect(201)
        .then( response => {
            expect(response.body.qrCodeId.length).toBeGreaterThan(0);
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste1",
                "quantidade": 10,
                "preco": "R$5.07"
            });
            expect(response.body.totalAmount).toBe(5070);
            expect(response.body.qrCodeText.length).toBeGreaterThan(0);
            expect(response.body.qrCodeBase64Link).not.toBeUndefined();
            expect(response.body.qrCodeBase64Link).not.toBeNull();
            expect(response.body.qrCodePngLink).not.toBeUndefined();
            expect(response.body.qrCodePngLink).not.toBeNull();

        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente anônimo, pedido de quatro itens válidos com quantidades 7, 9, 21 respectivamente deve funcionar com sucesso.`, async () => {
        await loadFixtures('3-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste1",
                            "quantidade": 7,
                            "preco": "R$5.07"
                        },
                        {
                            "nome": "item_teste2",
                            "quantidade": 9,
                            "preco": "R$9.86"
                        },
                        {
                            "nome": "item_teste3",
                            "quantidade": 21,
                            "preco": "R$0.01"
                        }
                    ]
                }
            }
        })
        .expect(201)
        .then( response => {
            expect(response.body.qrCodeId.length).toBeGreaterThan(0);
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste1",
                "quantidade": 7,
                "preco": "R$5.07"
            });
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste2",
                "quantidade": 9,
                "preco": "R$9.86"
            });
            expect(response.body.pedido).toContainEqual({
                "nome": "item_teste3",
                "quantidade": 21,
                "preco": "R$0.01"
            });
            expect(response.body.totalAmount).toBe(12444);
            expect(response.body.qrCodeText.length).toBeGreaterThan(0);
            expect(response.body.qrCodeBase64Link).not.toBeUndefined();
            expect(response.body.qrCodeBase64Link).not.toBeNull();
            expect(response.body.qrCodePngLink).not.toBeUndefined();
            expect(response.body.qrCodePngLink).not.toBeNull();

        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente válido, pedido único válido com quantidade acima da máxima permitida(30) deve ser rejeitado.`, async () => {
        await loadFixtures('2-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste",
                            "quantidade": 100,
                            "preco": "R$1.00"
                        }
                    ]
                },
                "cliente": {
                    "nome": "Jose da Silva",
                    "cpf": "12345678909",
                    "email": "email@test.com"
                }
            }
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["quantidade_maxima_excedida"]))
        .then( response => {
            expect(response.body.statusCode).toBe(testHttpStatusCodes(config["errors"]["status_code"]["quantidade_maxima_excedida"]));
            expect(response.body.message[0]).toBe("pedido.pedido.item.0." + config["errors"]["messages"]["quantidade_maxima_excedida"]);
        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente anônimo, pedido de três itens válidos com quantidades 7, 9, 33(máximo excedido) respectivamente deve ser rejeitado.`, async () => {
        await loadFixtures('3-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste1",
                            "quantidade": 7,
                            "preco": "R$5.07"
                        },
                        {
                            "nome": "item_teste2",
                            "quantidade": 9,
                            "preco": "R$9.86"
                        },
                        {
                            "nome": "item_teste3",
                            "quantidade": 33,
                            "preco": "R$0.01"
                        }
                    ]
                }
            }
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["quantidade_maxima_excedida"]))
        .then( response => {
            expect(response.body.statusCode).toBe(testHttpStatusCodes(config["errors"]["status_code"]["quantidade_maxima_excedida"]));
            expect(response.body.message[0]).toBe("pedido.pedido.item.2." + config["errors"]["messages"]["quantidade_maxima_excedida"]);
        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente válido, pedido único válido com quantidade igual a 99999999999999999 deve ser rejeitado.`, async () => {
        await loadFixtures('2-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste",
                            "quantidade": 99999999999999999,
                            "preco": "R$1.00"
                        }
                    ]
                },
                "cliente": {
                    "nome": "Jose da Silva",
                    "cpf": "12345678909",
                    "email": "email@test.com"
                }
            }
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["quantidade_maxima_excedida"]))
        .then( response => {
            expect(response.body.statusCode).toBe(testHttpStatusCodes(config["errors"]["status_code"]["quantidade_maxima_excedida"]));
            expect(response.body.message[0]).toBe("pedido.pedido.item.0." + config["errors"]["messages"]["quantidade_maxima_excedida"]);
        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando cliente válido, pedido único válido com quantidade igual a $#%&*a deve ser rejeitado.`, async () => {
        await loadFixtures('2-checkout.sql');

        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "pedido": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste",
                            "quantidade": "$#%&*a",
                            "preco": "R$1.00"
                        }
                    ]
                },
                "cliente": {
                    "nome": "Jose da Silva",
                    "cpf": "12345678909",
                    "email": "email@test.com"
                }
            }
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["bad_request"]))
        .then( response => {
            expect(response.body.statusCode).toBe(testHttpStatusCodes(config["errors"]["status_code"]["bad_request"]));
            expect(response.body.message).toContainEqual("pedido.pedido.item.0." + config["errors"]["messages"]["quantidade_maxima_excedida"]);
            expect(response.body.message).toContainEqual("pedido.pedido.item.0.quantidade must be a positive number");
            expect(response.body.message).toContainEqual("pedido.pedido.item.0.quantidade must be a number conforming to the specified constraints");
        });
    });

    testNo++;

    it(`${testNo} - Criar Qr Code usando corpo de requisição inválido deve ser rejeitado com código de status 404 e mensagem "Bad Request`, async () => {
        return request(app.getHttpServer())
        .post('/checkout/createQr')
        .send({
            "item": {
                "pedido": {
                    "item": [
                        {
                            "nome": "item_teste",
                            "quantidade": 99999999999999999,
                            "preco": "R$1.00"
                        }
                    ]
                },
                "cliente": {
                    "nome": "Jose da Silva",
                    "cpf": "12345678909",
                    "email": "email@test.com"
                }
            }
        })
        .expect(testHttpStatusCodes(config["errors"]["status_code"]["bad_request"]))
        .then( response => {
            expect(response.body.statusCode).toBe(testHttpStatusCodes(config["errors"]["status_code"]["bad_request"]));
        });
    });

    testNo++;

    it(`${testNo} - Criar Pedido com reference_id, created_at, items, customer válidos com sucesso`, async () => {
        await loadFixtures('2-pedido.sql');

        return request(app.getHttpServer())
        .post('/pedido/criar')
        .send(criarPedidoBody(
            "ex-00006",
            [
                {
                    "reference_id": "referencia do item",
                    "name": "item_teste",
                    "quantity": 1,
                    "unit_amount": 100
                }
            ], 
            {
                "nome": "Jose da Silva",
                "cpf": "12345678909",
                "email": "email@test.com"
            }
        ))
        .expect(201)
        .then( response => {
            expect(response.body.protocolo.id).toBe("ex-00006");
            expect(response.body.protocolo.cliente.nome).toBe("Jose da Silva");
            expect(response.body.protocolo.cliente.cpf).toBe("12345678909");
            expect(response.body.protocolo.cliente.email).toBe("email@test.com");
            expect(response.body.protocolo.pedido[0].quantidade).toBe(1);
            expect(response.body.protocolo.pedido[0].item.nome).toBe("item_teste");
            expect(response.body.protocolo.pedido[0].item.descricao).toBe("descricao_teste");
            expect(response.body.protocolo.pedido[0].item.categoria).toBe(1);
            expect(response.body.protocolo.pedido[0].item.preco).toBe("R$1.00");
            expect(response.body.protocolo.status).toBe(StatusPedido.RECEBIDO);
            expect(response.body.protocolo.createdAt).not.toBeUndefined();
            expect(response.body.protocolo.createdAt).not.toBeNull();
            expect(response.body.protocolo.receivedAt).not.toBeUndefined();
            expect(response.body.protocolo.receivedAt).not.toBeNull();
            expect(response.body.protocolo.preparedAt).not.toBeUndefined();
            expect(response.body.protocolo.preparedAt).not.toBeNull();
            expect(response.body.protocolo.doneAt).not.toBeUndefined();
            expect(response.body.protocolo.doneAt).not.toBeNull();

        });
    });

    testNo++;

    it(`${testNo} - Criar Pedido com reference_id duplicado deve ser rejeitado`, async () => {
        //await loadFixtures('3-pedido.sql');
    });

    testNo++;

    it(`${testNo} - Criar Pedido com reference_id, created_at, customer válidos mas item com nome(válido) e preço(conflitante) conflitantes deve ser rejeitado`, async () => {

    });

    testNo++;

    it(`${testNo} - Criar Pedido com reference_id, created_at, customer válidos mas item com nome(conflitante) e preço(válido) conflitantes deve ser rejeitado`, async () => {

    });

    testNo++;

    it(`${testNo} - Criar Pedido com reference_id, created_at, customer válidos mas item com nome(conflitante) e preço(conflitante) conflitantes deve ser rejeitado`, async () => {

    });

    testNo++;

    it(`${testNo} - Criar Pedido com reference_id, created_at, customer válidos mas 3 itens com dois tens válidos mas único item com nome(válido) e preço(conflitante) conflitantes deve ser rejeitado`, async () => {

    });

    testNo++;

    it(`${testNo} - Criar Pedido com reference_id, created_at, items válidos mas com customer inválido deve ser rejeitado`, async () => {

    });

    testNo++;

    it(`${testNo} - Criar Pedido com reference_id, created_at, items válidos mas com customer anônimo deve ser aceito com sucesso`, async () => {

    });


    testNo++;

    it(`${testNo} - Iniciar Pedido com Status RECEBIDO deve ser aceito com sucesso e o campo receivedAt > createdAt`, async () => {

    });

     testNo++;

    it(`${testNo} - Iniciar Pedido com Status PREPARANDO deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Iniciar Pedido com Status PRONTO deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Iniciar Pedido com Status FINALIZADO deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Terminar Pedido com Status PREPARANDO deve ser aceito com sucesso e o campo preparedAt > receivedAt`, async () => {

    });

     testNo++;

    it(`${testNo} - Terminar Pedido com Status RECEBIDO deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Terminar Pedido com Status PRONTO deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Terminar Pedido com Status FINALIZADO deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Finalizar Pedido com Status PRONTO deve ser aceito com sucesso e o campo doneAt > preparedAt`, async () => {

    });

     testNo++;

    it(`${testNo} - Finalizar Pedido com Status RECEBIDO deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Finalizar Pedido com Status PREPARANDO deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Finalizar Pedido com Status FINALIZADO deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Iniciar Pedido com id inválido deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Terminar Pedido com id inválido deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Finalizar Pedido com id inválido deve ser rejeitado`, async () => {

    });

     testNo++;

    it(`${testNo} - Listar todos os Pedidos deve ocorrer com sucesso`, async () => {

    });

     testNo++;

    it(`${testNo} - Listar todos os Pedidos Criados deve ocorrer com sucesso`, async () => {

    });

     testNo++;

    it(`${testNo} - Listar todos os Pedidos Recebidos deve ocorrer com sucesso`, async () => {

    });

     testNo++;

    it(`${testNo} - Listar todos os Pedidos Prontos deve ocorrer com sucesso`, async () => {

    });

     testNo++;

    it(`${testNo} - Listar todos os Pedidos Finalizados deve ocorrer com sucesso`, async () => {

    });

});