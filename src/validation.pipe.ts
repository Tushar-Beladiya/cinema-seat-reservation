import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
  Injectable,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

interface ValidationPipeOptions {
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  transform?: boolean;
  skipMissingProperties?: boolean;
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private readonly options: ValidationPipeOptions = {}) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    // Skip validation if metatype is not provided or it's not a class
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Transform the incoming request body to a DTO instance
    const object = plainToClass(metatype, value);

    // Perform validation
    const errors: ValidationError[] = await validate(object, this.options);

    // If there are validation errors, format the error response
    if (errors.length > 0) {
      // Format the error response to include a custom status
      const formattedErrors = errors.map((error) =>
        Object.values(error.constraints),
      );

      throw new HttpException(
        {
          status: false,
          message: formattedErrors.flat(),
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return value; // Return the valid value
  }

  private toValidate(metatype): boolean {
    // List of types that don't need validation
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
