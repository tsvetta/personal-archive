import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth.js';
import { ReactNode } from 'react';
import { AccessLevels } from '@archive/client/server/apollo/types.js';

type ProtectedPageProps = {
  accessLevel: AccessLevels;
  children: ReactNode;
};

const ProtectedPage = (props: ProtectedPageProps) => {
  const { user, loading, error } = useAuth();
  const notAllowed = user && props.accessLevel > user.accessLevel;

  const notAuthorized = !loading && !user;

  if (error) {
    console.error('\n Protected route error:', error);
  }

  if (notAllowed) {
    return <Navigate to='/' />;
  }

  if (notAuthorized || error || notAllowed) {
    return <Navigate to='/login' />;
  }

  return props.children;
};

ProtectedPage.defaultProps = {
  accessLevel: 0,
};

export default ProtectedPage;
