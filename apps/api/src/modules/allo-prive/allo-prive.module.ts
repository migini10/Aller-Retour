import { Module } from '@nestjs/common';
import { AlloPriveController } from './allo-prive.controller';
import { AlloPriveService } from './allo-prive.service';

@Module({
  controllers: [AlloPriveController],
  providers: [AlloPriveService]
})
export class AlloPriveModule {}
