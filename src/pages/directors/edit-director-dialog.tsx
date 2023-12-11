import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Skeleton, Stack } from '@mui/material';
import { FormDialog, TextField } from '../../components';
import {
  DataContext,
  type IDataContext,
  useUpdate,
  useFind,
  validateDate,
  formatDate
} from '../../utils';
import { HttpStatus } from '../../constants';
import {
  type IDirectorDto,
  type IApiErrorResponse,
  type IFormValue
} from '../../common';

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

const EditDirectorDialog = (props: IEditDirectorDialogProps) => {
  const { id, onClose, onEdited } = props;

  const { apiData, openSnackbar } = useContext(DataContext) as IDataContext;

  const [director, setDirector] = useState<IDirectorDto | null>(null);

  const [form, setForm] = useState<Record<string, IFormValue>>(initialForm);

  const {
    find: getDirector,
    loading: getDirectorLoading,
    response: getDirectorResponse,
    error: getDirectorError,
    clearResponse: clearGetDirectorResponse,
    clearError: clearGetDirectorError
  } = useFind(`${apiData.apiUrl}/directors/${id}`);

  useEffect(() => {
    getDirector(apiData.requestConfig);
  }, [apiData.requestConfig, getDirector]);

  if (getDirectorResponse) {
    if (getDirectorResponse.status === HttpStatus.OK) {
      const director = getDirectorResponse.data.resource;
      setDirector(director);
      setForm({
        name: {
          value: director.name,
          errorMessage: ''
        },
        country: {
          value: director.country,
          errorMessage: ''
        },
        bornOn: {
          value: formatDate(director.bornOn),
          errorMessage: ''
        }
      });
    }
    clearGetDirectorResponse();
  }

  if (getDirectorError) {
    if (getDirectorError.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (getDirectorError.response?.status === HttpStatus.NOT_FOUND) {
      openSnackbar('Director Not Found', 'error');
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    clearGetDirectorError();
    onClose();
  }

  const editDirector = useUpdate(`${apiData.apiUrl}/directors/${id}`);

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

  const handleEditDirectorButtonClick = () => {
    if (!checkForErrors()) {
      if (!checkIfValuesChanged()) {
        onClose();
        return;
      }
      const request = {
        name: form.name.value.trim(),
        country: form.country.value.trim(),
        bornOn: form.bornOn.value.trim()
      };
      editDirector.update(request, apiData.requestConfig);
    }
  };

  if (editDirector.response) {
    if (editDirector.response.status === HttpStatus.OK) {
      openSnackbar('Director Updated Successfully');
      onEdited(editDirector.response.data.resource);
    }
    editDirector.clearResponse();
  }

  if (editDirector.error) {
    if (editDirector.error.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (
      editDirector.error.response?.status === HttpStatus.UNPROCESSABLE_ENTITY
    ) {
      mapApiErrors(editDirector.error.response.data as IApiErrorResponse[]);
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    editDirector.clearError();
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

  const checkIfValuesChanged = () => {
    return (
      director?.name !== form.name.value ||
      director?.country !== form.country.value ||
      formatDate(director?.bornOn) !== form.bornOn.value
    );
  };

  return (
    <FormDialog
      title='Edit Director'
      isOpen
      onClose={onClose}
      onSubmit={handleEditDirectorButtonClick}
      submitButtonText='Edit'
      submitButtonLoading={editDirector.loading}
    >
      {getDirectorLoading ? (
        <>
          <Skeleton animation='wave' />
          <Skeleton animation='wave' />
          <Skeleton animation='wave' />
        </>
      ) : (
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
      )}
    </FormDialog>
  );
};

interface IEditDirectorDialogProps {
  id: number;
  onClose: () => void;
  onEdited: (director: IDirectorDto) => void;
}

export default EditDirectorDialog;
