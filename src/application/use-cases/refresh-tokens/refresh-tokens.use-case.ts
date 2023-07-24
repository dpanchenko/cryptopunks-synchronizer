import { RefreshTokenExpiredError } from '@domain/errors';
import { AuthTokensBlacklistRepository } from '@domain/repositories';
import { AuthTokenService } from '@domain/services';

import { RefreshTokensRequestDto } from './refresh-tokens.request.dto';
import { RefreshTokensResponseDto } from './refresh-tokens.response.dto';

export class RefreshTokensUseCase {
  constructor(
    private readonly authTokenService: AuthTokenService,
    private readonly authTokensBlacklistRepository: AuthTokensBlacklistRepository,
  ) {}

  async execute(
    params: RefreshTokensRequestDto,
  ): Promise<RefreshTokensResponseDto> {
    const { token } = params;

    const isExpired = await this.authTokensBlacklistRepository.checkToken(
      token,
    );

    if (isExpired) {
      throw new RefreshTokenExpiredError(`Token ${token} is expired`);
    }

    const { email } = await this.authTokenService.verifyRefreshToken(token);

    const { accessToken, refreshToken } =
      await this.authTokenService.generateAuthToken(email);

    await this.authTokensBlacklistRepository.saveToken(token);

    return { accessToken, refreshToken };
  }
}
