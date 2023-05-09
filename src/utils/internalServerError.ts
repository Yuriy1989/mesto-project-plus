import { INTERNAL_SERVER_ERROR } from '../constants';

export default class InternalServer extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}
