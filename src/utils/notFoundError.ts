import { NOT_FOUND } from '../constants';

export default class NotFound extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}
