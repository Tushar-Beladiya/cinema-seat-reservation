import { IsNotEmpty, IsNumber, Matches, Min } from 'class-validator';

export class CreateCinemaInput {
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/^(?!\s*$).+/, { message: 'Name cannot be empty or just spaces' })
  name: string;

  @IsNotEmpty({ message: 'Rows is required' })
  @IsNumber({}, { message: 'Rows must be a number' })
  @Min(1, { message: 'Rows must be greater than 0' })
  rows: number;

  @IsNotEmpty({ message: 'Seats per row is required' })
  @IsNumber({}, { message: 'Seats per row must be a number' })
  @Min(1, { message: 'Seats per row must be greater than 0' })
  seatsPerRow: number;
}
