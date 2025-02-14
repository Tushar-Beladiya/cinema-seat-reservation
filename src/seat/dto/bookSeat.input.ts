import { IsNotEmpty, IsNumber, Matches, Min } from 'class-validator';

export class BookSeatInput {
  @IsNotEmpty({ message: 'Cinema ID is required' })
  @Matches(/^(?!\s*$).+/, {
    message: 'Cinema ID cannot be empty or just spaces',
  })
  cinemaId: string;

  @IsNotEmpty({ message: 'Seat number is required' })
  @IsNumber({}, { message: 'Seat number must be a number' })
  @Min(1, { message: 'Seat number must be greater than 0' })
  seatNumber: number;

  @IsNotEmpty({ message: 'Row is required' })
  @IsNumber({}, { message: 'Row must be a number' })
  @Min(1, { message: 'Row must be greater than 0' })
  row: number;
}
