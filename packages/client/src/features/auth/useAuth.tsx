import { createContext, useContext, useState } from 'react';
import { useQuery, ApolloError } from '@apollo/client';

import { User } from '../../../server/apollo/types.js';
import { getUser } from '../../../server/apollo/queries.js';

interface AuthContextType {
  user?: User;
  loading?: boolean;
  error?: ApolloError;
  refetchUser: (uid: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: false,
  error: undefined,
  refetchUser: () => {},
});

export const AuthProvider = (props: {
  userId?: string;
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState(props.userId);

  const { loading, error, data } = useQuery(getUser, {
    variables: { id: userId },
    skip: !userId,
  });
  const user = data?.user;

  const refetchUser = (uid: string) => {
    setUserId(uid);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, refetchUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
