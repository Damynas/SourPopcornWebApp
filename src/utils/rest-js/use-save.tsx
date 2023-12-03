import { useCallback, useState } from 'react';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { type IAdditionalUrlParam, type ISaveReturn } from './interfaces';

const useSave = (url: string): ISaveReturn => {
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

  const saveData = useCallback(
    (
      request: object,
      config?: object,
      additionalUrlParams?: IAdditionalUrlParam[]
    ): void => {
      setLoading(true);
      axios
        .post(
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

  const save = useCallback(
    (
      request: object,
      config: object | undefined = undefined,
      additionalUrlParams: IAdditionalUrlParam[] | undefined = undefined
    ): void => {
      saveData(request, config, additionalUrlParams);
    },
    [saveData]
  );

  const clearResponse = useCallback((): void => {
    setResponse(null);
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return { response, loading, error, save, clearResponse, clearError };
};

export default useSave;
