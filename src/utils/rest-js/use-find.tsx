import { useCallback, useState } from 'react';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { type IAdditionalUrlParam, type IFindReturn } from './interfaces';

const useFind = (url: string): IFindReturn => {
  const [response, setResponse] = useState<AxiosResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const updateUrl = useCallback(
    (additionalUrlParams?: IAdditionalUrlParam[]): string => {
      let updatedUrl = url;
      additionalUrlParams?.forEach((param) => {
        updatedUrl = updatedUrl.replace(
          `{${param.name}}`,
          param.value.toString()
        );
      });
      return updatedUrl;
    },
    [url]
  );

  const fetchData = useCallback(
    (config?: object, additionalUrlParams?: IAdditionalUrlParam[]): void => {
      setLoading(true);
      axios
        .get(
          additionalUrlParams !== undefined
            ? updateUrl(additionalUrlParams)
            : url,
          config
        )
        .then((res) => {
          setResponse(res);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [url, updateUrl]
  );

  const find = useCallback(
    (
      config: object | undefined = undefined,
      additionalUrlParams: IAdditionalUrlParam[] | undefined = undefined
    ): void => {
      fetchData(config, additionalUrlParams);
    },
    [fetchData]
  );

  const clearResponse = useCallback((): void => {
    setResponse(null);
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return { response, loading, error, find, clearResponse, clearError };
};

export default useFind;
