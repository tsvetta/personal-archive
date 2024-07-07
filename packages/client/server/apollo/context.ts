import { UniversalCookies } from '../../src/utils/cookies.js';

export type ApolloContext = {
  authToken?: string;
  universalCookies?: UniversalCookies;
};
