import { SeatStatus } from '@prisma/client';
import { BaseModel } from 'src/utlis';

export class Seat extends BaseModel {
  row: number;
  seatNumber: number;
  status: SeatStatus;
  cinemaId: string;
}
