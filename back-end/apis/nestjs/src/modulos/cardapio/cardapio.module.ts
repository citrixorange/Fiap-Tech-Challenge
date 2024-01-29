import { Module } from '@nestjs/common';
import { CardapioService } from './core/applications/services/cardapioService';
import { CardapioController } from './adapter/driver/api/cardapio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCardapio } from './adapter/driven/db/typeorm/cardapio.entity';
import { CardapioRepository } from './adapter/driven/db/typeorm/cardapio.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ItemCardapio])],
  controllers: [CardapioController],
  providers: [
    CardapioService,
    {
        provide: 'ICardapio',
        useClass: CardapioRepository
    },
    CardapioRepository
  ],
  exports: [
    CardapioRepository
  ]
})
export class CardapioModule {}