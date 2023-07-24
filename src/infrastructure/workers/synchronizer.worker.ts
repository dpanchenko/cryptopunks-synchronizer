import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  SynchronizeTokensUseCase,
  SubscribeOnTransferUseCase,
  UpdateTokenOwnerUseCase,
} from '@application/use-cases';

@Injectable()
export class SynchronizeWorker implements OnModuleInit {
  private readonly logger: Logger = new Logger(SynchronizeWorker.name);
  constructor(
    private readonly synchronizeTokensUseCase: SynchronizeTokensUseCase,
    private readonly subscribeOnTransferUseCase: SubscribeOnTransferUseCase,
    private readonly updateTokenOwnerUseCase: UpdateTokenOwnerUseCase,
  ) {}

  onModuleInit(): void {
    this.logger.debug('Syncronizer worker initialized');
    this.synchronizeTokensUseCase.execute().then((tokensCount) => {
      this.logger.debug(`Syncronized ${tokensCount} tokens`);
      this.subscribeOnTransferUseCase.execute({
        listener: (contract, tokenId, owner) => {
          this.updateTokenOwnerUseCase
            .execute({
              contract,
              tokenId,
              owner,
            })
            .then(({ token }) => {
              this.logger.log(
                `Token ${token.tokenId} (contract ${token.contract}) owner updated ${token.owner}`,
              );
            })
            .catch((err) => {
              this.logger.error(`Error updating token owner ${err}`);
            });
        },
      });
    });
  }
}
