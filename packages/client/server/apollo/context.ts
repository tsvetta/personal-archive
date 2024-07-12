import { UniversalCookies } from '../../src/utils/cookies.js';
import { UserDataFromToken } from './types.js';

export type ApolloContext = {
  authToken?: string;
  user?: UserDataFromToken;
  universalCookies?: UniversalCookies;
};
