import { BlockchainService } from '@domain/services';

import { SubscribeOnTransferRequestDto } from './subscribe-on-transfer.request.dto';
import { SubscribeOnTransferResponseDto } from './subscribe-on-transfer.response.dto';

export class SubscribeOnTransferUseCase {
  constructor(private readonly blockchainService: BlockchainService) {}

  async execute(
    params: SubscribeOnTransferRequestDto,
  ): Promise<SubscribeOnTransferResponseDto> {
    const { listener } = params;
    this.blockchainService.subscribeOnTransferEvents(listener);
  }
}
