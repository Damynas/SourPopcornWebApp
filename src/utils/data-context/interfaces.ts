import { SnackbarVariant } from '../../components/feedback/use-snackbar';

export interface IUser {
  userId: number;
  roles: string[];
}

export interface IApiData {
  apiUrl: string;
  requestConfig: object;
}

export interface IDataContext {
  apiData: IApiData;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  openSnackbar: (message: string, variant?: SnackbarVariant) => void;
}
