import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma';

@Injectable()
export class CinemaService {
  constructor(private readonly prismaService: PrismaService) {}
  getHello() {
    return 'Hello Cinema!!';
  }
}
