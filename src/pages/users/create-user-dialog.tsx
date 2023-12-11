import { ChangeEvent, useContext, useState } from 'react';
import { Stack } from '@mui/material';
import { FormDialog, Repeater, Select, TextField } from '../../components';
import { DataContext, type IDataContext, useSave } from '../../utils';
import { HttpStatus, UserRole } from '../../constants';
import {
  type IFormValue,
  type IApiErrorResponse,
  type IUserDto
} from '../../common';

const initialForm = {
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
  },
  roles: {
    value: [
      {
        value: UserRole.USER,
        errorMessage: ''
      }
    ],
    errorMessage: ''
  }
};

const roles = [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN];

const CreateUserDialog = (props: ICreateUserDialogProps) => {
  const { onClose, onCreated } = props;

  const { apiData, openSnackbar } = useContext(DataContext) as IDataContext;

  const createUser = useSave(`${apiData.apiUrl}/users`);

  const [form, setForm] = useState<
    Record<
      string,
      {
        value: string | IFormValue[];
        errorMessage: string;
      }
    >
  >(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({
      ...form,
      [event.target.name]: {
        value: event.target.value,
        errorMessage: ''
      }
    });
  };

  const onRoleChange = (name: string, value: unknown) => {
    if (name.startsWith('role')) {
      const index = parseInt(
        name.substring(name.indexOf('[') + 1, name.indexOf(']'))
      );
      const updatedRolesValue = form.roles.value as IFormValue[];
      updatedRolesValue[index].value = value as string;
      updatedRolesValue[index].errorMessage = '';
      setForm({
        ...form,
        roles: {
          ...form.roles,
          value: updatedRolesValue
        }
      });
    }
  };

  const onRoleAdd = () => {
    const updatedRolesValue = form.roles.value as IFormValue[];
    updatedRolesValue.push({ value: '', errorMessage: '' });
    setForm({
      ...form,
      roles: {
        ...form.roles,
        value: updatedRolesValue
      }
    });
  };

  const onRoleRemove = (index: number) => {
    const updatedRolesValue = form.roles.value as IFormValue[];
    updatedRolesValue.splice(index, 1);
    setForm({
      ...form,
      roles: {
        ...form.roles,
        value: updatedRolesValue
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

  const handleCreateUserButtonClick = () => {
    if (!checkForErrors()) {
      const request = {
        username: (form.username.value as string).trim(),
        password: (form.password.value as string).trim(),
        displayName: (form.displayName.value as string).trim(),
        roles: (form.roles.value as IFormValue[]).map((r) => r.value)
      };
      createUser.save(request, apiData.requestConfig);
    }
  };

  if (createUser.response) {
    if (createUser.response.status === HttpStatus.CREATED_AT_ROUTE) {
      openSnackbar('User Created Successfully');
      onCreated(createUser.response.data.resource);
    }
    createUser.clearResponse();
  }

  if (createUser.error) {
    if (createUser.error.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (
      createUser.error.response?.status === HttpStatus.UNPROCESSABLE_ENTITY
    ) {
      mapApiErrors(createUser.error.response.data as IApiErrorResponse[]);
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    createUser.clearError();
  }

  const checkForErrors = () => {
    let hasErrors = false;
    const validationErrors = [];
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

    if (!form.username.value) {
      validationErrors.push({
        propertyName: 'username',
        errorMessage: 'Required'
      });
    } else if (form.username.value.length > 20) {
      validationErrors.push({
        propertyName: 'username',
        errorMessage: 'Username cannot exceed 20 characters.'
      });
    }

    if (!form.password.value) {
      validationErrors.push({
        propertyName: 'password',
        errorMessage: 'Required'
      });
    } else if (form.password.value.length < 8) {
      validationErrors.push({
        propertyName: 'password',
        errorMessage: 'Your password must have at least 8 characters.'
      });
    } else if (!passwordRegex.test(form.password.value as string)) {
      validationErrors.push({
        propertyName: 'password',
        errorMessage:
          'Your password must contain at least one uppercase and lowercase letter, one number and at least on special character.'
      });
    }

    if (!form.displayName.value) {
      validationErrors.push({
        propertyName: 'displayName',
        errorMessage: 'Required'
      });
    } else if (form.displayName.value.length > 20) {
      validationErrors.push({
        propertyName: 'displayName',
        errorMessage: 'Display name cannot exceed 20 characters.'
      });
    }

    (form.roles.value as IFormValue[]).forEach((role, index) => {
      if (!role.value) {
        validationErrors.push({
          propertyName: `role[${index}]`,
          errorMessage: 'Required'
        });
      }
    });

    if (validationErrors.length !== 0) {
      let updatedForm = form;
      validationErrors.forEach((validationError) => {
        if (validationError.propertyName.startsWith('role')) {
          const index = parseInt(
            validationError.propertyName.substring(
              validationError.propertyName.indexOf('[') + 1,
              validationError.propertyName.indexOf(']')
            )
          );
          const updatedRolesValue = form.roles.value as IFormValue[];
          updatedRolesValue[index].errorMessage = validationError.errorMessage;
          setForm({
            ...form,
            roles: {
              ...form.roles,
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

  const isAddButtonVisible = () => {
    return (
      roles.filter(
        (role) =>
          !(form.roles.value as IFormValue[])
            .map((r) => r.value)
            ?.includes(role)
      ).length > 0
    );
  };

  const getRoleOptions = (value: string) => {
    return roles.filter(
      (role) =>
        value === role ||
        !(form.roles.value as IFormValue[]).map((r) => r.value)?.includes(role)
    );
  };

  return (
    <FormDialog
      title='Create User'
      isOpen
      onClose={onClose}
      onSubmit={handleCreateUserButtonClick}
      submitButtonText='Create'
      submitButtonLoading={createUser.loading}
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
          value={form.username.value}
          onChange={handleChange}
          error={form.username.errorMessage !== ''}
          helperText={form.username.errorMessage}
        />
        <TextField
          label='Password'
          name='password'
          inputSize='md'
          type='password'
          required
          value={form.password.value}
          onChange={handleChange}
          error={form.password.errorMessage !== ''}
          helperText={form.password.errorMessage}
        />
        <TextField
          label='Display Name'
          name='displayName'
          inputSize='md'
          required
          value={form.displayName.value}
          onChange={handleChange}
          error={form.displayName.errorMessage !== ''}
          helperText={form.displayName.errorMessage}
        />
        <Repeater
          title='Roles'
          onAdd={onRoleAdd}
          onRemove={onRoleRemove}
          addButtonVisible={isAddButtonVisible()}
          addButtonText='Add Role'
          maxItemCount={roles.length}
          firstItemRequired
          firstItemReadOnly
        >
          {(form.roles.value as IFormValue[]).map((role, index) => (
            <Select
              key={index}
              label='Role'
              name={`role[${index}]`}
              placeholder='Select Role'
              inputSize='sm'
              value={role.value}
              options={getRoleOptions(role.value)}
              onChange={onRoleChange}
              error={role.errorMessage !== ''}
              helperText={role.errorMessage}
              removeMargin
              required
            />
          ))}
        </Repeater>
      </Stack>
    </FormDialog>
  );
};

interface ICreateUserDialogProps {
  onClose: () => void;
  onCreated: (user: IUserDto) => void;
}

export default CreateUserDialog;
