import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma';
import { BookSeatInput } from './dto/bookSeat.input';

@Injectable()
export class SeatService {
  constructor(private readonly prismaService: PrismaService) {}
  async bookSeat(input: BookSeatInput) {
    const { cinemaId, seatNumber, row } = input;
    // Use a transaction to ensure the seat status is checked and updated atomically
    const seat = await this.prismaService.$transaction(async (prisma) => {
      // Fetch the seat by cinemaId and seatNumber
      const seat = await prisma.seat.findUnique({
        where: {
          cinemaId_row_seatNumber: {
            cinemaId,
            row,
            seatNumber,
          },
        },
      });

      // Check if seat exists
      if (!seat) {
        throw new NotFoundException('Seat not found');
      }

      // Check if the seat is already booked
      if (seat.status === 'Booked') {
        throw new BadRequestException('Seat is already Booked');
      }

      // Proceed with booking the seat if it is available
      const updatedSeat = await prisma.seat.update({
        where: {
          id: seat.id,
        },
        data: {
          status: 'Booked',
        },
      });

      return updatedSeat; // Return the updated seat information
    });

    // Return the seat that was successfully booked
    return {
      cinemaId: seat.cinemaId,
      row: seat.row,
      seatNumber: seat.seatNumber,
      status: seat.status,
    };
  }
}
