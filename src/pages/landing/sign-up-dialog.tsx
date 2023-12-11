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
  },
  displayName: {
    value: '',
    errorMessage: ''
  }
};

const SignUpDialog = (props: ISignUpDialogProps) => {
  const { onClose } = props;

  const { apiData, openSnackbar } = useContext(DataContext) as IDataContext;
  const navigate = useNavigate();

  const signUp = useSave(`${apiData.apiUrl}/auth/register`);

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

  const handleSignUpButtonClick = () => {
    if (!checkForSignUpErrors()) {
      const request = {
        username: credentials.username.value.trim(),
        password: credentials.password.value.trim(),
        displayName: credentials.displayName.value.trim()
      };
      signUp.save(request, apiData.requestConfig);
    }
  };

  if (signUp.response) {
    if (signUp.response.status === HttpStatus.CREATED_AT_ROUTE) {
      onClose();
      openSnackbar('Signed Up Successfully');
      navigate('/');
    }
    signUp.clearResponse();
  }

  if (signUp.error) {
    if (signUp.error.response?.status === HttpStatus.UNPROCESSABLE_ENTITY) {
      mapApiErrors(signUp.error.response.data as IApiErrorResponse[]);
    } else {
      openSnackbar('Sign Up Unsuccessful', 'error');
    }
    signUp.clearError();
  }

  const checkForSignUpErrors = () => {
    let hasErrors = false;
    const validationErrors = [];
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

    if (!credentials.username.value) {
      validationErrors.push({
        propertyName: 'username',
        errorMessage: 'Required'
      });
    } else if (credentials.username.value.length > 20) {
      validationErrors.push({
        propertyName: 'username',
        errorMessage: 'Username cannot exceed 20 characters.'
      });
    }

    if (!credentials.password.value) {
      validationErrors.push({
        propertyName: 'password',
        errorMessage: 'Required'
      });
    } else if (credentials.password.value.length < 8) {
      validationErrors.push({
        propertyName: 'password',
        errorMessage: 'Your password must have at least 8 characters.'
      });
    } else if (!passwordRegex.test(credentials.password.value)) {
      validationErrors.push({
        propertyName: 'password',
        errorMessage:
          'Your password must contain at least one uppercase and lowercase letter, one number and at least on special character.'
      });
    }

    if (!credentials.displayName.value) {
      validationErrors.push({
        propertyName: 'displayName',
        errorMessage: 'Required'
      });
    } else if (credentials.displayName.value.length > 20) {
      validationErrors.push({
        propertyName: 'displayName',
        errorMessage: 'Display name cannot exceed 20 characters.'
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
      title='Sign Up'
      submitButtonText='Sign Up'
      isOpen
      onClose={onClose}
      onSubmit={handleSignUpButtonClick}
      submitButtonLoading={signUp.loading}
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
        <TextField
          label='Display Name'
          name='displayName'
          inputSize='md'
          required
          value={credentials.displayName.value}
          onChange={handleChange}
          error={credentials.displayName.errorMessage !== ''}
          helperText={credentials.displayName.errorMessage}
        />
      </Stack>
    </FormDialog>
  );
};

interface ISignUpDialogProps {
  onClose: () => void;
}

export default SignUpDialog;
