import { ThemeProvider } from '@mui/material';
import { DataContextProvider } from './utils';
import { Router, theme } from './common';

const Application = () => {
  return (
    <ThemeProvider theme={theme}>
      <DataContextProvider>
        <Router />
      </DataContextProvider>
    </ThemeProvider>
  );
};

export default Application;
