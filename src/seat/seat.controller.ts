import { Body, Controller, Param, Post } from '@nestjs/common';
import { BookSeatInput } from './dto/bookSeat.input';
import { SeatService } from './seat.service';

@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post('book')
  async bookSeat(@Body() input: BookSeatInput) {
    try {
      const result = await this.seatService.bookSeat(input);
      return {
        success: true,
        message: 'Seat booked successfully!',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to book seat',
        error: error.message,
      };
    }
  }

  @Post(':cinemaId/book-consecutive-seats')
  async purchaseConsecutiveSeats(@Param('cinemaId') cinemaId: string) {
    try {
      const result = await this.seatService.bookConsecutiveSeats(cinemaId);
      return {
        success: true,
        message: 'Seat booked successfully!',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to book seat',
        error: error.message,
      };
    }
  }
}
