import { useCallback, useContext, useEffect, useState } from 'react';
import { DataContext, useSave, type IDataContext, IUser } from '..';
import { HttpStatus } from '../../constants';

const useAuth = (): IReturn => {
  const [errorStatusCode, setErrorStatusCode] = useState<number | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);

  const { apiData } = useContext(DataContext) as IDataContext;

  const {
    save: ping,
    response: pingResponse,
    error: pingError,
    clearResponse: clearPingResponse,
    clearError: clearPingError
  } = useSave(`${apiData.apiUrl}/auth/ping`);

  const {
    save: refreshAccessToken,
    response: refreshAccessTokenResponse,
    error: refreshAccessTokenError,
    clearResponse: clearRefreshAccessTokenResponse,
    clearError: clearRefreshAccessTokenError
  } = useSave(`${apiData.apiUrl}/auth/refresh_access_token`);

  useEffect(() => {
    if (pingResponse) {
      if (pingResponse.status === HttpStatus.OK) {
        setUser(pingResponse.data);
        setAuthenticated(true);
        setLoading(false);
      }
      clearPingResponse();
    }
  }, [clearPingResponse, pingResponse, setUser]);

  useEffect(() => {
    if (pingError) {
      switch (pingError.response?.status) {
        case HttpStatus.UNAUTHORIZED:
          refreshAccessToken({}, apiData.requestConfig);
          break;
        case HttpStatus.FORBIDDEN:
          setErrorStatusCode(HttpStatus.FORBIDDEN);
          setLoading(false);
          break;
        default:
          setLoading(false);
          break;
      }
      clearPingError();
    }
  }, [clearPingError, apiData.requestConfig, pingError, refreshAccessToken]);

  useEffect(() => {
    if (refreshAccessTokenResponse) {
      if (refreshAccessTokenResponse.status === HttpStatus.OK) {
        ping({}, apiData.requestConfig);
      }
      clearRefreshAccessTokenResponse();
    }
  }, [
    clearRefreshAccessTokenResponse,
    apiData.requestConfig,
    ping,
    refreshAccessTokenResponse
  ]);

  useEffect(() => {
    if (refreshAccessTokenError) {
      switch (refreshAccessTokenError.response?.status) {
        case HttpStatus.UNAUTHORIZED:
          setErrorStatusCode(HttpStatus.UNAUTHORIZED);
          setLoading(false);
          break;
        case HttpStatus.FORBIDDEN:
          setErrorStatusCode(HttpStatus.FORBIDDEN);
          setLoading(false);
          break;
        default:
          setLoading(false);
          break;
      }
      clearRefreshAccessTokenError();
    }
  }, [clearRefreshAccessTokenError, refreshAccessTokenError]);

  const resetState = () => {
    setErrorStatusCode(null);
    setAuthenticated(false);
    setLoading(true);
    setUser(null);
  };

  const authenticate = useCallback(() => {
    resetState();
    ping({}, apiData.requestConfig);
  }, [apiData.requestConfig, ping]);

  return {
    authenticate,
    loading,
    authenticated,
    user,
    errorStatusCode
  };
};

interface IReturn {
  authenticate: () => void;
  loading: boolean;
  authenticated: boolean;
  user: IUser | null;
  errorStatusCode: number | null;
}

export default useAuth;
