import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { Connection } from "typeorm";
import { AppModule } from "../src/app.module";
import { loadFixtures as loadFixturesBase } from "./utils";

let app: INestApplication;
let mod: TestingModule;
let connection: Connection;

const loadFixtures = async (sqlFileName: string) => loadFixturesBase(connection, sqlFileName);

describe('Cardapio (e2e)', () => {

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

    it('1 - Deve criar um novo Item para o Cardapio.', async () => {
        return request(app.getHttpServer())
            .post('/cardapio')
            .send({
                nome: "item_teste",
                descricao: "descricao_teste",
                categoria: "Lanche",
                preco: "R$1.00"
            })
            .expect(201)
            .then(response => {
                expect(response.body.nome).toBe("item_teste");
                expect(response.body.descricao).toBe("descricao_teste");
                expect(response.body.categoria).toBe("Lanche");
                expect(response.body.preco).toBe("R$1.00");
            });
    });

    it('2 - Deve editar um Item para o Cardapio.', async () => {

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
                expect(response.body[0].nome).toBe("item_teste");
                expect(response.body[0].descricao).toBe("nova_descricao_teste");
                expect(response.body[0].categoria).toBe("Lanche");
                expect(response.body[0].preco).toBe("R$1.00");
            });
        });
    });

    it('3 - Deve remover o Item do Cardapio.', async () => {

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
                expect(response.body).toEqual([]);
            });
        });
    });

    it('4 - Deve listar todos os Itens do Cardapio.', async () => {

        await loadFixtures('4-cardapio.sql');

        return request(app.getHttpServer())
        .get('/cardapio')
        .expect(200)
        .then(response => {
            expect(response.body.length).toBe(4);

            expect(response.body[0].nome).toBe("item_teste1");
            expect(response.body[0].descricao).toBe("descricao_teste1");
            expect(response.body[0].categoria).toBe("Lanche");
            expect(response.body[0].preco).toBe("R$1.00");

            expect(response.body[1].nome).toBe("item_teste2");
            expect(response.body[1].descricao).toBe("descricao_teste2");
            expect(response.body[1].categoria).toBe("Acompanhamento");
            expect(response.body[1].preco).toBe("R$1.00");

            expect(response.body[2].nome).toBe("item_teste3");
            expect(response.body[2].descricao).toBe("descricao_teste3");
            expect(response.body[2].categoria).toBe("Bebida");
            expect(response.body[2].preco).toBe("R$1.00");

            expect(response.body[3].nome).toBe("item_teste4");
            expect(response.body[3].descricao).toBe("descricao_teste4");
            expect(response.body[3].categoria).toBe("Sobremesa");
            expect(response.body[3].preco).toBe("R$1.00");
        });
    });

    it('5 - Deve listar todos os Itens de uma Categoria do Cardapio.', async () => {

        await loadFixtures('5-cardapio.sql');

        return request(app.getHttpServer())
        .get('/cardapio').query({
            categoria: "Lanche"
        })
        .expect(200)
        .then(response => {
            expect(response.body.length).toBe(2);

            expect(response.body[0].nome).toBe("item_teste1");
            expect(response.body[0].descricao).toBe("descricao_teste1");
            expect(response.body[0].categoria).toBe("Lanche");
            expect(response.body[0].preco).toBe("R$1.00");

            expect(response.body[1].nome).toBe("item_teste2");
            expect(response.body[1].descricao).toBe("descricao_teste2");
            expect(response.body[1].categoria).toBe("Lanche");
            expect(response.body[1].preco).toBe("R$1.00");
        });
    });

});