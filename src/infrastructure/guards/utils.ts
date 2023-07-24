import { Request } from 'express';

export const extractTokenFromRequest = (
  request: Request,
): string | undefined => {
  const headers = request.headers;
  const query = request.query;

  if (query.token) {
    return query.token as string;
  }

  if (headers.authorization) {
    const bearerTokenArray = headers.authorization.split(' ', 2);

    if (bearerTokenArray.length >= 2) {
      return bearerTokenArray[1];
    }
  }

  return undefined;
};
