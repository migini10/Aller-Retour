import { Test, TestingModule } from '@nestjs/testing';
import { AlloPriveService } from './allo-prive.service';

describe('AlloPriveService', () => {
  let service: AlloPriveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlloPriveService],
    }).compile();

    service = module.get<AlloPriveService>(AlloPriveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
