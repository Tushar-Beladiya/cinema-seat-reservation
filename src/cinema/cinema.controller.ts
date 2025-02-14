import { Body, Controller, Post } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CreateCinemaInput } from './dto/createCinema.input';

@Controller('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Post('create')
  async createCinema(@Body() input: CreateCinemaInput) {
    try {
      const result = await this.cinemaService.createCinema(input);
      return {
        success: true,
        message: 'Cinema created successfully!',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create cinema',
        error: error.message,
      };
    }
  }
}
