import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma';
import { BookSeatInput } from './dto/bookSeat.input';
import { Seat, SeatStatus } from '@prisma/client';

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
      if (seat.status === SeatStatus.Booked) {
        throw new BadRequestException('Seat is already Booked');
      }

      // Proceed with booking the seat if it is available
      const updatedSeat = await prisma.seat.update({
        where: {
          id: seat.id,
        },
        data: {
          status: SeatStatus.Booked,
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

  async bookConsecutiveSeats(cinemaId: string) {
    const seatsAvailable = await this.prismaService.seat.count({
      where: { cinemaId, status: SeatStatus.Available },
    });

    if (seatsAvailable === 0) {
      throw new BadRequestException('No seats available to book');
    }

    // Start a transaction to ensure atomicity of seat updates
    const seats: Seat[] = await this.prismaService.$transaction(
      async (prisma) => {
        // Fetch all seats for the given cinema, grouped by rows
        const cinemaSeats = await prisma.seat.findMany({
          where: { cinemaId },
          orderBy: [{ row: 'asc' }, { seatNumber: 'asc' }],
        });

        // Group seats by row
        const rows: { [row: number]: Seat[] } =
          this.groupSeatsByRow(cinemaSeats);

        let consecutiveSeats: Seat[] = [];
        for (const row of Object.values(rows)) {
          consecutiveSeats = this.findConsecutiveAvailableSeats(row);

          // If we find consecutive seats, we stop searching further
          if (consecutiveSeats.length > 0) {
            break;
          }
        }

        // If no consecutive seats were found, return an error
        if (consecutiveSeats.length === 0) {
          throw new BadRequestException('No consecutive seats available');
        }

        // Update the status of the found seats to Booked
        await prisma.seat.updateMany({
          where: {
            id: {
              in: consecutiveSeats.map((seat) => seat.id),
            },
          },
          data: {
            status: SeatStatus.Booked,
          },
        });

        return consecutiveSeats;
      },
    );

    // Return the details of the booked seats
    return seats.map((seat) => ({
      cinemaId: seat.cinemaId,
      row: seat.row,
      seatNumber: seat.seatNumber,
      status: seat.status,
    }));
  }

  // Group seats by row
  private groupSeatsByRow(seats: Seat[]) {
    return seats.reduce((rows, seat) => {
      if (!rows[seat.row]) {
        rows[seat.row] = [];
      }
      rows[seat.row].push(seat);
      return rows;
    }, {});
  }

  // Find two consecutive available seats in a row
  private findConsecutiveAvailableSeats(row: Seat[]) {
    for (let i = 0; i < row.length - 1; i++) {
      if (
        row[i].status === SeatStatus.Available &&
        row[i + 1].status === SeatStatus.Available
      ) {
        return [row[i], row[i + 1]];
      }
    }
    return [];
  }
}
