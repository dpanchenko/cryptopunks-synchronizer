import { BlockchainTransferListener } from '@domain/types';

export interface SubscribeOnTransferRequestDto {
  listener: BlockchainTransferListener;
}
