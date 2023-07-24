import { AbstractError } from './abstract.error';

export class ApplicationError extends AbstractError {
  constructor(public message: string) {
    super(message, 400);
    this.name = this.constructor.name;
  }
}
