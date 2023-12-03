import { type AxiosError, type AxiosResponse } from 'axios';

interface IReturn {
  response: AxiosResponse | null;
  error: AxiosError | null;
  loading: boolean;
  clearResponse: () => void;
  clearError: () => void;
}

export interface IFindReturn extends IReturn {
  find: (config?: object, additionalUrlParams?: IAdditionalUrlParam[]) => void;
}

export interface ISaveReturn extends IReturn {
  save: (
    request: object,
    config?: object,
    additionalUrlParams?: IAdditionalUrlParam[]
  ) => void;
}

export interface IUpdateReturn extends IReturn {
  update: (
    request: object,
    config?: object,
    additionalUrlParams?: IAdditionalUrlParam[]
  ) => void;
}

export interface IRemoveReturn extends IReturn {
  remove: (
    config?: object,
    additionalUrlParams?: IAdditionalUrlParam[]
  ) => void;
}

export interface IAdditionalUrlParam {
  name: string;
  value: string | number;
}
