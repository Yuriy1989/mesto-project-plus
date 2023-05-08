import {
  BAD_REQUEST,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND, UNAUTHORIZED,
} from '../constants';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  static badRequest(message: string) {
    return new NotFoundError(message, BAD_REQUEST);
  }

  static unauthorized(message: string) {
    return new NotFoundError(message, UNAUTHORIZED);
  }

  static notFound(message: string) {
    return new NotFoundError(message, NOT_FOUND);
  }

  static conflict(message: string) {
    return new NotFoundError(message, CONFLICT);
  }

  static internalServerError(message: string) {
    return new NotFoundError(message, INTERNAL_SERVER_ERROR);
  }
}
