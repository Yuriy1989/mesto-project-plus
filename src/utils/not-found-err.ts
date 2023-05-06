import { BAD_REQUEST } from '../constants';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  static badRequest(message: string) {
    return new NotFoundError(message, BAD_REQUEST);
  }
}
