import { Test, TestingModule } from '@nestjs/testing';
import { KfcController } from './kfc.controller';
import { KfcService } from './kfc.service';

describe('KfcController', () => {
  let controller: KfcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KfcController],
      providers: [KfcService],
    }).compile();

    controller = module.get<KfcController>(KfcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
