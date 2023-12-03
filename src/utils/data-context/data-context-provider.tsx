import React, { type ReactElement, useState } from 'react';
import { type IUser } from './interfaces';
import DataContext from './data-context';
import { InitialApiDataContext } from '.';
import { useSnackbar } from '../../components';

interface DataContextProps {
  children?: ReactElement;
}

const DataContextProvider: React.FC<DataContextProps> = ({ children }) => {
  const { renderSnackbar, openSnackbar } = useSnackbar();
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <DataContext.Provider
      value={{ apiData: InitialApiDataContext, user, setUser, openSnackbar }}
    >
      {children}
      {renderSnackbar()}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
