import {
  SubscribeOnTransferUseCase,
  SubscribeOnTransferRequestDto,
} from '@application/use-cases';
import { BlockchainService } from '@domain/services';

import { BlockchainMockService } from './mocks/services';

describe('Subscribe on transfer use case', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('execute succesfully', async () => {
    const blockchainService: BlockchainService = new BlockchainMockService();
    const useCase: SubscribeOnTransferUseCase = new SubscribeOnTransferUseCase(
      blockchainService,
    );
    const useCaseParams: SubscribeOnTransferRequestDto = {
      listener: () => {
        return;
      },
    };

    const blockchainService_subscribeOnTransferEvents = jest.spyOn(
      blockchainService,
      'subscribeOnTransferEvents',
    );

    await useCase.execute(useCaseParams);
    expect(blockchainService_subscribeOnTransferEvents).toBeCalledTimes(1);
    expect(blockchainService_subscribeOnTransferEvents).toBeCalledWith(
      useCaseParams.listener,
    );
  });
});
