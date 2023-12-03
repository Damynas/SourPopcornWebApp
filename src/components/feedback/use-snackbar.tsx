import { useState } from 'react';
import { Snackbar as MaterialSnackbar } from '@mui/material';
import { Alert } from '.';

const useSnackbar = () => {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarVariant, setSnackbarVariant] =
    useState<SnackbarVariant>('success');

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason !== 'clickaway') {
      setSnackbarOpen(false);
    }
  };

  const renderSnackbar = () => {
    return (
      <MaterialSnackbar
        open={snackbarOpen}
        onClose={handleClose}
        autoHideDuration={3000}
      >
        <Alert
          severity={snackbarVariant}
          variant='outlined'
          message={snackbarMessage}
        />
      </MaterialSnackbar>
    );
  };

  const openSnackbar = (
    message: string,
    variant: SnackbarVariant = 'success'
  ) => {
    setSnackbarVariant(variant);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  return {
    renderSnackbar,
    openSnackbar
  };
};

export type SnackbarVariant = 'success' | 'warning' | 'error' | 'info';

export default useSnackbar;
