import { Module } from '@nestjs/common';
import { CinemaModule } from './cinema';
import { DatabaseModule } from './libs/database';

@Module({
  imports: [CinemaModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
