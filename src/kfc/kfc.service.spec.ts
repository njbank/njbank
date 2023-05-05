import { Test, TestingModule } from '@nestjs/testing';
import { KfcService } from './kfc.service';

describe('KfcService', () => {
  let service: KfcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KfcService],
    }).compile();

    service = module.get<KfcService>(KfcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
