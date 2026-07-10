import { Test, TestingModule } from '@nestjs/testing';
import { AlloPriveController } from './allo-prive.controller';

describe('AlloPriveController', () => {
  let controller: AlloPriveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlloPriveController],
    }).compile();

    controller = module.get<AlloPriveController>(AlloPriveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
