import { Module } from '@nestjs/common';
import { ClienteService } from './core/applications/services/cliente.service';
import { ClienteController } from './adapter/driver/api/cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './adapter/driven/db/typeorm/cliente.entity';
import { ClienteRepository } from './adapter/driven/db/typeorm/cliente.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClienteController],
  providers: [
    ClienteService,
    {
        provide: 'ICadastroCliente',
        useClass: ClienteRepository
    },
    ClienteRepository
  ],
  exports: [
    ClienteRepository,
    ClienteService
  ]
})
export class ClienteModule {}