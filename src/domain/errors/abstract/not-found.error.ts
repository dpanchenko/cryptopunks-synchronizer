import { AbstractError } from './abstract.error';

export class NotFoundError extends AbstractError {
  constructor(public message: string) {
    super(message, 404);
    this.name = this.constructor.name;
  }
}
