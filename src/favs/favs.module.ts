import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { Favorites } from './entities/fav.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorites])],
  controllers: [FavsController],
  providers: [FavsService],
  exports: [FavsService],
})
export class FavsModule {}
