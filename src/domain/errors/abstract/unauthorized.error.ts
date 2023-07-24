import { AbstractError } from './abstract.error';

export class UnauthorizedError extends AbstractError {
  constructor(public message: string) {
    super(message, 403);
    this.name = this.constructor.name;
  }
}
