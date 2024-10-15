import { createContext, useContext } from 'react';
import { ApolloError } from '@apollo/client';

import { User } from '@archive/server/src/apollo/types.js';

interface AuthContextType {
  user?: User;
  loading?: boolean;
  error?: ApolloError;
  refetchUser: (uid: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: false,
  error: undefined,
  refetchUser: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};
