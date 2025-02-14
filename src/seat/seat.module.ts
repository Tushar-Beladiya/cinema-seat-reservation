import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { CinemaService } from 'src/cinema';

@Module({
  imports: [],
  controllers: [SeatController],
  providers: [SeatService, CinemaService],
})
export class SeatModule {}
