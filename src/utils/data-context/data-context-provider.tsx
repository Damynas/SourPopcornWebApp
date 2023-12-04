import React, { type ReactElement, useState, useMemo } from 'react';
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

  const memoizedData = useMemo(() => {
    return { apiData: InitialApiDataContext, user, setUser, openSnackbar };
  }, [user, setUser, openSnackbar]);

  return (
    <DataContext.Provider value={memoizedData}>
      {children}
      {renderSnackbar()}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
