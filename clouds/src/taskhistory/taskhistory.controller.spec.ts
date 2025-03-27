import { Test, TestingModule } from '@nestjs/testing';
import { TaskhistoryController } from './taskhistory.controller';

describe('TaskhistoryController', () => {
  let controller: TaskhistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskhistoryController],
    }).compile();

    controller = module.get<TaskhistoryController>(TaskhistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
