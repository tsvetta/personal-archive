import { UniversalCookies } from '@archive/common/cookies.js';
import { UserDataFromToken } from './types.js';

export type ApolloContext = {
  user?: UserDataFromToken;
  universalCookies?: UniversalCookies;
};
