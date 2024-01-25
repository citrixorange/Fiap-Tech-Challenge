import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/*
Ponto de Observação para o Time:
Aqui acredito que temos algo que pode ferir levemente a proposta da arquitetura Hexagonal, 
o motivo está fortemente acoplado com a forma que o módulo TypeOrm necessita declarar as
entidades (Classes Concretas ao invés de abstratas) no módulo root. Talvez possamos estudar alguma forma
de fazer esse import de forma distribuída em cada módulo: Pedido, Cliente, Cardápio...Obedecendo assim 
a arquitetura hexagonal.
*/

import { Cliente } from '../modulos/cliente/adapter/driven/db/typeorm/cliente.entity';
import { ItemCardapio } from '../modulos/cardapio/adapter/driven/db/typeorm/cardapio.entity';


export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: "postgres",
    password: "DATABASE_PASSWORD",
    database: process.env.DATABASE_NAME,
    entities: [
        Cliente,
        ItemCardapio
    ],
    synchronize: true,
    logging: Boolean(parseInt(process.env.DATABASE_LOG_ENABLE)),
    dropSchema: Boolean(parseInt(process.env.DATABASE_DROP_SCHEMA))
  })
);