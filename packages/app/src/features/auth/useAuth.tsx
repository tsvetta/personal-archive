import { createContext, useContext, useState } from 'react';
import { useQuery, ApolloError, useMutation } from '@apollo/client';

import { User } from '@archive/server/src/apollo/types.js';
import { getUser } from '@archive/app/src/apollo/queries.js';
import { logoutUser as logoutUserQ } from '@archive/app/src/apollo/queries.js';

interface AuthContextType {
  user?: User;
  loading?: boolean;
  error?: ApolloError;
  refetchUser: (uid: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: false,
  error: undefined,
  refetchUser: () => {},
  logout: () => {},
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

  const [logoutUser] = useMutation(logoutUserQ);

  const logout = async () => {
    await logoutUser();

    setUserId(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, refetchUser, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
