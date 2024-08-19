import { ApolloError } from 'apollo-server-errors';

export class AuthorizationError extends ApolloError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED');

    Object.defineProperty(this, 'name', { value: 'AuthorizationError' });

    this.extensions.code = 401;
  }
}
