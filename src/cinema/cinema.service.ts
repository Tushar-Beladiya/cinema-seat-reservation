import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma';
import { CreateCinemaInput } from './dto/createCinema.input';

@Injectable()
export class CinemaService {
  constructor(private readonly prismaService: PrismaService) {}
  async createCinema(input: CreateCinemaInput) {
    const { name, rows, seatsPerRow } = input;

    // Start a transaction to ensure that both cinema and seats are created atomically
    const cinema = await this.prismaService.$transaction(async (prisma) => {
      // Create cinema
      const newCinema = await prisma.cinema.create({
        data: {
          name,
          rows,
          seatsPerRow,
        },
      });

      // Create seats for the cinema
      const seats = [];
      for (let row = 1; row <= rows; row++) {
        for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
          seats.push({
            cinemaId: newCinema.id,
            row,
            seatNumber,
          });
        }
      }

      // Insert seats into the database
      await prisma.seat.createMany({
        data: seats,
      });

      return newCinema;
    });

    return { cinemaId: cinema.id };
  }
}
