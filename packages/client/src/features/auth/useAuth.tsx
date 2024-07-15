import {
  ReactElement,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDataFromToken } from '../../../server/apollo/types.js';

interface AuthContextType {
  user: UserDataFromToken | {};
  login: (data: UserDataFromToken) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: {},
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({
  children,
  user,
}: {
  children: ReactElement;
  user: any;
}) => {
  const [userContext, setUserContext] = useState(user);
  const navigate = useNavigate();

  const login = async (data: UserDataFromToken) => {
    setUserContext(data);
    navigate('/');
  };

  const logout = () => {
    setUserContext({});
    navigate('/login', { replace: true });
  };

  const value = useMemo(
    () => ({
      user: userContext,
      login,
      logout,
    }),
    [userContext]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
