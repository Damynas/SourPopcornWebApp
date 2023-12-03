import { useEffect, type ReactElement, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext, hasRole, type IDataContext, useAuth } from '../../utils';
import { HttpStatus, UserRole } from '../../constants';
import { LoadingPage } from '../../pages';

const ProtectedRoute = (props: IProtectedRouteProps) => {
  const { role, children } = props;

  const { setUser } = useContext(DataContext) as IDataContext;
  const navigate = useNavigate();

  const { authenticate, loading, authenticated, user, errorStatusCode } =
    useAuth();

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  if (!loading) {
    if (authenticated) {
      setUser(user);
      if (!hasRole(user, role)) {
        navigate('/forbidden');
      }
    } else {
      setUser(null);
      switch (errorStatusCode) {
        case HttpStatus.UNAUTHORIZED:
          navigate('/unauthorized');
          break;
        case HttpStatus.FORBIDDEN:
          navigate('/forbidden');
          break;
        default:
          navigate('/error');
          break;
      }
    }
  }

  return loading ? <LoadingPage /> : children;
};

interface IProtectedRouteProps {
  role: (typeof UserRole)[keyof typeof UserRole];
  children: ReactElement;
}

export default ProtectedRoute;
