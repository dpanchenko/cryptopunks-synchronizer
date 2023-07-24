import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IAuthConfig } from '@config/index';
import { IAuthRequest, ProtectionContext, IAuthDecodedToken } from '../types';
import { extractTokenFromRequest } from './utils';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly authConfig: IAuthConfig;

  constructor(
    private reflector: Reflector,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {
    this.authConfig = this.configService.get('auth') as IAuthConfig;
  }

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    try {
      const context = GqlExecutionContext.create(executionContext);
      const protectionContext: ProtectionContext =
        this.reflector.get<ProtectionContext>(
          'protectionContext',
          context.getHandler(),
        );

      if (protectionContext !== true) {
        return true;
      }

      const request: IAuthRequest = context.getContext().req;

      const authToken = extractTokenFromRequest(request);

      if (authToken) {
        const decodedToken: IAuthDecodedToken =
          await this.jwtService.verifyAsync<IAuthDecodedToken>(authToken, {
            secret: this.authConfig.authTokenSecret,
          });

        if (decodedToken) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { iat, exp, email } = decodedToken;

          request.authToken = authToken;
          request.email = email;
        }

        return true;
      } else {
        throw new UnauthorizedException('No auth token');
      }

      return false;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
