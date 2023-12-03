import { createContext } from 'react';
import { type IDataContext } from './interfaces';

const DataContext = createContext<IDataContext | null>(null);

export default DataContext;
