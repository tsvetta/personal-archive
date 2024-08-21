import { ApolloClient } from '@apollo/client';
import { FetchFunction } from 'isomorphic-fetch';

export interface CreateApolloClientOptions {
  fetch?: FetchFunction;
  headerCookie?: string;
}

export function createApolloClient(
  options?: CreateApolloClientOptions
): ApolloClient<any>;
