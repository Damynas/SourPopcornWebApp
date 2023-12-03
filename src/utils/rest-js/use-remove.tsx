import { useCallback, useState } from 'react';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { type IAdditionalUrlParam, type IRemoveReturn } from './interfaces';

const useRemove = (url: string): IRemoveReturn => {
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

  const deleteData = useCallback(
    (config?: object, additionalUrlParams?: IAdditionalUrlParam[]): void => {
      setLoading(true);
      axios
        .delete(
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

  const remove = useCallback(
    (
      config: object | undefined = undefined,
      additionalUrlParams: IAdditionalUrlParam[] | undefined = undefined
    ): void => {
      deleteData(config, additionalUrlParams);
    },
    [deleteData]
  );

  const clearResponse = useCallback((): void => {
    setResponse(null);
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return { response, loading, error, remove, clearResponse, clearError };
};

export default useRemove;
