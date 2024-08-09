import { createContext, useContext } from 'react';
import { useQuery, ApolloError } from '@apollo/client';

import { User } from '../../../server/apollo/types.js';
import { getUser } from '../../../server/apollo/queries.js';

interface AuthContextType {
  user?: User;
  loading?: boolean;
  error?: ApolloError;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: false,
  error: undefined,
});

export const AuthProvider = ({
  userId,
  children,
}: {
  userId?: string;
  children: React.ReactNode;
}) => {
  const { loading, error, data } = useQuery(getUser, {
    variables: { id: userId },
    skip: !userId,
  });

  const user = data?.user;

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
