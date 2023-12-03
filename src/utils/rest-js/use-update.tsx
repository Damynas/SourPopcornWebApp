import { useCallback, useState } from 'react';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { type IAdditionalUrlParam, type IUpdateReturn } from './interfaces';

const useUpdate = (url: string): IUpdateReturn => {
  const [response, setResponse] = useState<AxiosResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const updateUrl = useCallback(
    (additionalUrlParams: IAdditionalUrlParam[]): string => {
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

  const updateData = useCallback(
    (
      request: object,
      config?: object,
      additionalUrlParams?: IAdditionalUrlParam[]
    ): void => {
      setLoading(true);
      axios
        .put(
          additionalUrlParams !== undefined
            ? updateUrl(additionalUrlParams)
            : url,
          request,
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

  const update = useCallback(
    (
      request: object,
      config: object | undefined = undefined,
      additionalUrlParams: IAdditionalUrlParam[] | undefined = undefined
    ): void => {
      updateData(request, config, additionalUrlParams);
    },
    [updateData]
  );

  const clearResponse = useCallback((): void => {
    setResponse(null);
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return { response, loading, error, update, clearResponse, clearError };
};

export default useUpdate;
