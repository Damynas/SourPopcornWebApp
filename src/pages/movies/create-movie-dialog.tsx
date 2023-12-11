import { ChangeEvent, useContext, useState } from 'react';
import { Stack } from '@mui/material';
import { FormDialog, Repeater, Select, TextField } from '../../components';
import {
  DataContext,
  type IDataContext,
  useSave,
  validateDate
} from '../../utils';
import { HttpStatus } from '../../constants';
import {
  type IMovieDto,
  type IApiErrorResponse,
  type IDirectorDto,
  type IFormValue
} from '../../common';

const initialForm = {
  title: {
    value: '',
    errorMessage: ''
  },
  posterLink: {
    value: '',
    errorMessage: ''
  },
  description: {
    value: '',
    errorMessage: ''
  },
  directorId: {
    value: '',
    errorMessage: ''
  },
  country: {
    value: '',
    errorMessage: ''
  },
  language: {
    value: '',
    errorMessage: ''
  },
  releasedOn: {
    value: '',
    errorMessage: ''
  },
  writers: {
    value: [],
    errorMessage: ''
  },
  actors: {
    value: [],
    errorMessage: ''
  }
};

const CreateMovieDialog = (props: ICreateMovieDialogProps) => {
  const { directors, onClose, onCreated } = props;

  const { apiData, openSnackbar } = useContext(DataContext) as IDataContext;

  const createMovie = useSave(`${apiData.apiUrl}/movies`);

  const [form, setForm] = useState<
    Record<
      string,
      {
        value: string | IFormValue[];
        errorMessage: string;
      }
    >
  >(initialForm);
  const [createMovieDialogErrorMessage, setCreateMovieDialogErrorMessage] =
    useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({
      ...form,
      [event.target.name]: {
        value: event.target.value,
        errorMessage: ''
      }
    });
  };

  const handleSelectChange = (name: string, value: unknown): void => {
    setForm({
      ...form,
      [name]: {
        value: value as string,
        errorMessage: ''
      }
    });
  };

  const handleRepeaterInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name.startsWith('writer') || name.startsWith('actor')) {
      const index = parseInt(
        name.substring(name.indexOf('[') + 1, name.indexOf(']'))
      );
      const updatedName = name.substring(0, name.indexOf('['));
      const updatedRepeaterInputValue = form[`${updatedName}s`]
        .value as IFormValue[];
      updatedRepeaterInputValue[index].value = value;
      updatedRepeaterInputValue[index].errorMessage = '';
      setForm({
        ...form,
        [`${updatedName}s`]: {
          ...form[`${updatedName}s`],
          value: updatedRepeaterInputValue
        }
      });
    }
  };

  const onRepeaterAdd = (name: string) => {
    if (name === 'writers' || name === 'actors') {
      const updatedRepeaterValue = form[name].value as IFormValue[];
      updatedRepeaterValue.push({ value: '', errorMessage: '' });
      setForm({
        ...form,
        [name]: {
          ...form[name],
          value: updatedRepeaterValue
        }
      });
    }
  };

  const onRepeaterRemove = (name: string, index: number) => {
    if (name === 'writers' || name === 'actors') {
      const updatedRepeaterValue = form[name].value as IFormValue[];
      updatedRepeaterValue.splice(index, 1);
      setForm({
        ...form,
        [name]: {
          ...form[name],
          value: updatedRepeaterValue
        }
      });
    }
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

  const handleCreateMovieButtonClick = () => {
    if (!checkForErrors()) {
      const request = {
        title: (form.title.value as string).trim(),
        description: (form.description.value as string).trim(),
        posterLink: (form.posterLink.value as string).trim(),
        directorId: parseInt((form.directorId.value as string).trim()),
        country: (form.country.value as string).trim(),
        language: (form.language.value as string).trim(),
        releasedOn: (form.releasedOn.value as string).trim(),
        writers: (form.writers.value as IFormValue[]).map((w) => w.value),
        actors: (form.actors.value as IFormValue[]).map((a) => a.value)
      };
      createMovie.save(request, apiData.requestConfig);
    }
  };

  if (createMovie.response) {
    if (createMovie.response.status === HttpStatus.CREATED_AT_ROUTE) {
      openSnackbar('Movie Created Successfully');
      onCreated(createMovie.response.data.resource);
    }
    createMovie.clearResponse();
  }

  if (createMovie.error) {
    if (createMovie.error.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (createMovie.error.response?.status === HttpStatus.NOT_FOUND) {
      setCreateMovieDialogErrorMessage(
        createMovie.error.response.data as string
      );
    } else if (
      createMovie.error.response?.status === HttpStatus.UNPROCESSABLE_ENTITY
    ) {
      mapApiErrors(createMovie.error.response.data as IApiErrorResponse[]);
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    createMovie.clearError();
  }

  const checkForErrors = () => {
    let hasErrors = false;
    const validationErrors = [];

    if (!form.title.value) {
      validationErrors.push({
        propertyName: 'title',
        errorMessage: 'Required'
      });
    } else if (form.title.value.length > 20) {
      validationErrors.push({
        propertyName: 'title',
        errorMessage: `Movie's title cannot exceed 20 characters.`
      });
    }

    if (!form.description.value) {
      validationErrors.push({
        propertyName: 'description',
        errorMessage: 'Required'
      });
    } else if (form.description.value.length > 200) {
      validationErrors.push({
        propertyName: 'description',
        errorMessage: `Movie's description cannot exceed 20 characters.`
      });
    }

    if (!form.directorId.value) {
      validationErrors.push({
        propertyName: 'directorId',
        errorMessage: 'Required'
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

    if (!form.language.value) {
      validationErrors.push({
        propertyName: 'language',
        errorMessage: 'Required'
      });
    } else if (form.language.value.length > 20) {
      validationErrors.push({
        propertyName: 'language',
        errorMessage: 'Language cannot exceed 20 characters.'
      });
    }

    if (!form.releasedOn.value) {
      validationErrors.push({
        propertyName: 'releasedOn',
        errorMessage: 'Required'
      });
    } else if (!validateDate(form.releasedOn.value as string)) {
      validationErrors.push({
        propertyName: 'releasedOn',
        errorMessage: `Invalid date. Must follow format: 'YYYY-MM-DD'.`
      });
    }

    (form.writers.value as IFormValue[]).forEach((writer, index) => {
      if (!writer.value) {
        validationErrors.push({
          propertyName: `writer[${index}]`,
          errorMessage: 'Required'
        });
      }
    });

    (form.actors.value as IFormValue[]).forEach((actor, index) => {
      if (!actor.value) {
        validationErrors.push({
          propertyName: `actor[${index}]`,
          errorMessage: 'Required'
        });
      }
    });

    if (validationErrors.length !== 0) {
      let updatedForm = form;
      validationErrors.forEach((validationError) => {
        if (
          validationError.propertyName.startsWith('writer') ||
          validationError.propertyName.startsWith('actor')
        ) {
          const index = parseInt(
            validationError.propertyName.substring(
              validationError.propertyName.indexOf('[') + 1,
              validationError.propertyName.indexOf(']')
            )
          );
          const updatedPropertyName = validationError.propertyName.substring(
            0,
            validationError.propertyName.indexOf('[')
          );
          const updatedRolesValue = form[`${updatedPropertyName}s`]
            .value as IFormValue[];
          updatedRolesValue[index].errorMessage = validationError.errorMessage;
          setForm({
            ...form,
            [`${updatedPropertyName}s`]: {
              ...form[`${updatedPropertyName}s`],
              value: updatedRolesValue
            }
          });
          return;
        }
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

  const getDirectorOptions = () => {
    return directors.map((director) => director.id.toString());
  };

  const getOptionLabel = (option: unknown) => {
    return (
      directors.find(
        (director) => director.id.toString() === (option as string)
      )?.name ?? (option as string)
    );
  };

  return (
    <FormDialog
      title='Create Movie'
      isOpen
      onClose={onClose}
      onSubmit={handleCreateMovieButtonClick}
      submitButtonText='Create'
      submitButtonLoading={createMovie.loading}
      errorMessage={createMovieDialogErrorMessage}
    >
      <Stack
        direction='column'
        display='flex'
        justifyContent='center'
        alignItems='flex-start'
      >
        <TextField
          label='Title'
          name='title'
          inputSize='md'
          required
          value={form.title.value}
          onChange={handleChange}
          error={form.title.errorMessage !== ''}
          helperText={form.title.errorMessage}
        />
        <TextField
          label='Description'
          name='description'
          inputSize='md'
          required
          multiline
          rows={3}
          value={form.description.value}
          onChange={handleChange}
          error={form.description.errorMessage !== ''}
          helperText={form.description.errorMessage}
        />
        <TextField
          label='Poster Link'
          name='posterLink'
          inputSize='md'
          value={form.posterLink.value}
          onChange={handleChange}
          error={form.posterLink.errorMessage !== ''}
          helperText={form.posterLink.errorMessage}
        />
        <Select
          label='Director'
          name='directorId'
          placeholder='Select Director'
          inputSize='md'
          value={form.directorId.value as string}
          options={getDirectorOptions()}
          getOptionLabel={getOptionLabel}
          onChange={handleSelectChange}
          error={form.directorId.errorMessage !== ''}
          helperText={form.directorId.errorMessage}
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
        <Stack
          direction='row'
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <TextField
            label='Language'
            name='language'
            inputSize='sm'
            required
            value={form.language.value}
            onChange={handleChange}
            error={form.language.errorMessage !== ''}
            helperText={form.language.errorMessage}
          />
          <TextField
            label='Released On'
            name='releasedOn'
            inputSize='sm'
            required
            placeholder='YYYY-MM-DD'
            value={form.releasedOn.value}
            onChange={handleChange}
            error={form.releasedOn.errorMessage !== ''}
            helperText={form.releasedOn.errorMessage}
          />
        </Stack>
        <Stack
          direction='row'
          display='flex'
          justifyContent='space-between'
          alignItems='flex-start'
        >
          <Repeater
            title='Writers'
            onAdd={() => onRepeaterAdd('writers')}
            onRemove={(index: number) => onRepeaterRemove('writers', index)}
            addButtonText='Add Writer'
          >
            {(form.writers.value as IFormValue[]).map((writer, index) => (
              <TextField
                key={index}
                label='Writer'
                name={`writer[${index}]`}
                inputSize='sm'
                required
                value={writer.value}
                onChange={handleRepeaterInputChange}
                error={writer.errorMessage !== ''}
                helperText={writer.errorMessage}
              />
            ))}
          </Repeater>
          <Repeater
            title='Actors'
            onAdd={() => onRepeaterAdd('actors')}
            onRemove={(index: number) => onRepeaterRemove('actors', index)}
            addButtonText='Add Actor'
          >
            {(form.actors.value as IFormValue[]).map((actor, index) => (
              <TextField
                key={index}
                label='Actor'
                name={`actor[${index}]`}
                inputSize='sm'
                required
                value={actor.value}
                onChange={handleRepeaterInputChange}
                error={actor.errorMessage !== ''}
                helperText={actor.errorMessage}
              />
            ))}
          </Repeater>
        </Stack>
      </Stack>
    </FormDialog>
  );
};

interface ICreateMovieDialogProps {
  directors: IDirectorDto[];
  onClose: () => void;
  onCreated: (movie: IMovieDto) => void;
}

export default CreateMovieDialog;
