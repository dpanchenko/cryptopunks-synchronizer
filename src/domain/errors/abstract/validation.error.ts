import { AbstractError } from './abstract.error';

export class ValidationError extends AbstractError {
  constructor(public message: string) {
    super(message, 400);
    this.name = this.constructor.name;
  }
}
