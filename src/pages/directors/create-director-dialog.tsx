import { ChangeEvent, useContext, useState } from 'react';
import { Stack } from '@mui/material';
import { FormDialog, TextField } from '../../components';
import {
  DataContext,
  type IDataContext,
  useSave,
  validateDate
} from '../../utils';
import { HttpStatus } from '../../constants';
import { type IFormValue, type IApiErrorResponse } from '../../common';

const initialForm = {
  name: {
    value: '',
    errorMessage: ''
  },
  country: {
    value: '',
    errorMessage: ''
  },
  bornOn: {
    value: '',
    errorMessage: ''
  }
};

const CreateDirectorDialog = (props: ICreateDirectorDialogProps) => {
  const { onClose } = props;

  const { apiData, openSnackbar } = useContext(DataContext) as IDataContext;

  const createDirector = useSave(`${apiData.apiUrl}/directors`);

  const [form, setForm] = useState<Record<string, IFormValue>>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({
      ...form,
      [event.target.name]: {
        value: event.target.value,
        errorMessage: ''
      }
    });
  };

  const mapApiErrors = (errors: IApiErrorResponse[]) => {
    let updatedForm = form;
    errors.forEach((error) => {
      updatedForm = {
        ...updatedForm,
        [error.propertyName.toLowerCase()]: {
          ...updatedForm[error.propertyName.toLowerCase()],
          errorMessage: error.value
        }
      };
    });
    setForm(updatedForm);
  };

  const handleCreateDirectorButtonClick = () => {
    if (!checkForErrors()) {
      const request = {
        Name: form.name.value.trim(),
        Country: form.country.value.trim(),
        BornOn: form.bornOn.value.trim()
      };
      createDirector.save(request, apiData.requestConfig);
    }
  };

  if (createDirector.response) {
    if (createDirector.response.status === HttpStatus.CREATED_AT_ROUTE) {
      openSnackbar('Director Created Successfully');
      onClose();
    }
    createDirector.clearResponse();
  }

  if (createDirector.error) {
    if (createDirector.error.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (
      createDirector.error.response?.status === HttpStatus.UNPROCESSABLE_ENTITY
    ) {
      mapApiErrors(createDirector.error.response.data as IApiErrorResponse[]);
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    createDirector.clearError();
  }

  const checkForErrors = () => {
    let hasErrors = false;
    const validationErrors = [];

    if (!form.name.value) {
      validationErrors.push({
        propertyName: 'name',
        errorMessage: 'Required'
      });
    } else if (form.name.value.length > 20) {
      validationErrors.push({
        propertyName: 'name',
        errorMessage: `Director's name cannot exceed 20 characters.`
      });
    }

    if (!form.country.value) {
      validationErrors.push({
        propertyName: 'country',
        errorMessage: 'Required'
      });
    } else if (form.country.value.length > 20) {
      validationErrors.push({
        propertyName: 'country',
        errorMessage: 'Country cannot exceed 20 characters.'
      });
    }

    if (!form.bornOn.value) {
      validationErrors.push({
        propertyName: 'bornOn',
        errorMessage: 'Required'
      });
    } else if (!validateDate(form.bornOn.value)) {
      validationErrors.push({
        propertyName: 'bornOn',
        errorMessage: `Invalid date. Must follow format: 'YYYY-MM-DD'.`
      });
    }

    if (validationErrors.length !== 0) {
      let updatedForm = form;
      validationErrors.forEach((validationError) => {
        updatedForm = {
          ...updatedForm,
          [validationError.propertyName]: {
            ...updatedForm[validationError.propertyName],
            errorMessage: validationError.errorMessage
          }
        };
      });
      setForm(updatedForm);
      hasErrors = true;
    }

    return hasErrors;
  };

  return (
    <FormDialog
      title='Create Director'
      isOpen
      onClose={onClose}
      onSubmit={handleCreateDirectorButtonClick}
      submitButtonText='Create'
      submitButtonLoading={createDirector.loading}
    >
      <Stack
        direction='column'
        display='flex'
        justifyContent='center'
        alignItems='flex-start'
      >
        <TextField
          label='Name'
          name='name'
          inputSize='md'
          required
          value={form.name.value}
          onChange={handleChange}
          error={form.name.errorMessage !== ''}
          helperText={form.name.errorMessage}
        />
        <TextField
          label='Country'
          name='country'
          inputSize='md'
          required
          value={form.country.value}
          onChange={handleChange}
          error={form.country.errorMessage !== ''}
          helperText={form.country.errorMessage}
        />
        <TextField
          label='Born On'
          name='bornOn'
          inputSize='md'
          required
          placeholder='YYYY-MM-DD'
          value={form.bornOn.value}
          onChange={handleChange}
          error={form.bornOn.errorMessage !== ''}
          helperText={form.bornOn.errorMessage}
        />
      </Stack>
    </FormDialog>
  );
};

interface ICreateDirectorDialogProps {
  onClose: () => void;
}

export default CreateDirectorDialog;
