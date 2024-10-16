import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import {
  getUser,
  logoutUser as logoutUserQ,
} from '@archive/app/src/apollo/queries.js';
import { AuthContext } from './useAuth.js';

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
