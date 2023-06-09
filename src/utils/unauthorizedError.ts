import { UNAUTHORIZED } from '../constants';

export default class Unauthorized extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}
