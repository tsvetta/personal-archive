import { ApolloContext } from '../../context.js';
import { deleteAuthTokens } from '../../../../src/features/auth/index.js';
import { AuthorizationError } from '../../errors.js';

export const logoutUser = async (_: any, __: any, context: ApolloContext) => {
  if (!context.user) {
    throw new AuthorizationError('Unauthorized');
  }

  await deleteAuthTokens(context.user?.userId, context.universalCookies);

  return 'OK';
};
