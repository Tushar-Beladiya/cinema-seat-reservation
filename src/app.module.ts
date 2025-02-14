import { Module } from '@nestjs/common';
import { CinemaModule } from './cinema';
import { DatabaseModule } from './libs/database';
import { SeatModule } from './seat';

@Module({
  imports: [CinemaModule, DatabaseModule, SeatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
