import { type ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormDialog, TextField } from '../../components';
import { DataContext, useSave, type IDataContext } from '../../utils';
import { HttpStatus } from '../../constants';
import { Stack } from '@mui/material';
import { type IApiErrorResponse, type IFormValue } from '../../common';

const initialCredentials = {
  username: {
    value: '',
    errorMessage: ''
  },
  password: {
    value: '',
    errorMessage: ''
  }
};

const SignInDialog = (props: ISignInDialogProps) => {
  const { onClose } = props;

  const { apiData, openSnackbar } = useContext(DataContext) as IDataContext;
  const navigate = useNavigate();

  const signIn = useSave(`${apiData.apiUrl}/auth/login`);

  const [credentials, setCredentials] =
    useState<Record<string, IFormValue>>(initialCredentials);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCredentials({
      ...credentials,
      [event.target.name]: {
        value: event.target.value,
        errorMessage: ''
      }
    });
  };

  const mapApiErrors = (errors: IApiErrorResponse[]) => {
    let updatedCredentials = credentials;
    errors.forEach((error) => {
      updatedCredentials = {
        ...updatedCredentials,
        [error.propertyName.toLowerCase()]: {
          ...updatedCredentials[error.propertyName.toLowerCase()],
          errorMessage: error.value
        }
      };
    });
    setCredentials(updatedCredentials);
  };

  const [signInFormDialogErrorMessage, setSignInFormDialogErrorMessage] =
    useState<string>('');

  const handleSignInButtonClick = () => {
    setSignInFormDialogErrorMessage('');
    if (!checkForSignInErrors()) {
      const request = {
        Username: credentials.username.value.trim(),
        Password: credentials.password.value.trim()
      };
      signIn.save(request, apiData.requestConfig);
    }
  };

  if (signIn.response) {
    if (signIn.response.status === HttpStatus.OK) {
      onClose();
      openSnackbar('Signed In Successfully');
      navigate('/home');
    }
    signIn.clearResponse();
  }

  if (signIn.error) {
    if (signIn.error.response?.status === HttpStatus.NOT_FOUND) {
      setSignInFormDialogErrorMessage(signIn.error.response.data as string);
    } else if (
      signIn.error.response?.status === HttpStatus.UNPROCESSABLE_ENTITY
    ) {
      mapApiErrors(signIn.error.response.data as IApiErrorResponse[]);
    } else {
      openSnackbar('Sign In Unsuccessful', 'error');
    }
    signIn.clearError();
  }

  const checkForSignInErrors = () => {
    let hasErrors = false;
    const validationErrors = [];

    if (!credentials.username.value) {
      validationErrors.push({
        propertyName: 'username',
        errorMessage: 'Required'
      });
    }

    if (!credentials.password.value) {
      validationErrors.push({
        propertyName: 'password',
        errorMessage: 'Required'
      });
    }

    if (validationErrors.length !== 0) {
      let updatedCredentials = credentials;
      validationErrors.forEach((validationError) => {
        updatedCredentials = {
          ...updatedCredentials,
          [validationError.propertyName]: {
            ...updatedCredentials[validationError.propertyName],
            errorMessage: validationError.errorMessage
          }
        };
      });
      setCredentials(updatedCredentials);
      hasErrors = true;
    }

    return hasErrors;
  };

  return (
    <FormDialog
      title='Sign In'
      submitButtonText='Sign In'
      isOpen
      onClose={onClose}
      onSubmit={handleSignInButtonClick}
      submitButtonLoading={signIn.loading}
      errorMessage={signInFormDialogErrorMessage}
    >
      <Stack
        direction='column'
        display='flex'
        justifyContent='center'
        alignItems='flex-start'
      >
        <TextField
          label='Username'
          name='username'
          inputSize='md'
          required
          value={credentials.username.value}
          onChange={handleChange}
          error={credentials.username.errorMessage !== ''}
          helperText={credentials.username.errorMessage}
        />
        <TextField
          label='Password'
          name='password'
          inputSize='md'
          type='password'
          required
          value={credentials.password.value}
          onChange={handleChange}
          error={credentials.password.errorMessage !== ''}
          helperText={credentials.password.errorMessage}
        />
      </Stack>
    </FormDialog>
  );
};

interface ISignInDialogProps {
  onClose: () => void;
}

export default SignInDialog;
