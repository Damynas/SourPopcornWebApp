import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Skeleton, Stack } from '@mui/material';
import { FormDialog, Repeater, Select, TextField } from '../../components';
import {
  DataContext,
  type IDataContext,
  useUpdate,
  useFind
} from '../../utils';
import { HttpStatus, UserRole } from '../../constants';
import {
  type IUserDto,
  type IApiErrorResponse,
  type IFormValue
} from '../../common';

const initialForm = {
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

const EditUserDialog = (props: IEditUserDialogProps) => {
  const { onClose, id } = props;

  const { apiData, openSnackbar } = useContext(DataContext) as IDataContext;

  const [user, setUser] = useState<IUserDto | null>(null);

  const [form, setForm] = useState<
    Record<
      string,
      {
        value: string | IFormValue[];
        errorMessage: string;
      }
    >
  >(initialForm);

  const {
    find: getUser,
    loading: getUserLoading,
    response: getUserResponse,
    error: getUserError,
    clearResponse: clearGetUserResponse,
    clearError: clearGetUserError
  } = useFind(`${apiData.apiUrl}/users/${id}`);

  useEffect(() => {
    getUser(apiData.requestConfig);
  }, [apiData.requestConfig, getUser]);

  if (getUserResponse) {
    if (getUserResponse.status === HttpStatus.OK) {
      const user = getUserResponse.data.resource;
      setUser(user);
      setForm({
        displayName: {
          value: user.displayName,
          errorMessage: ''
        },
        roles: {
          value: (user.roles as string[]).map((role) => ({
            value: role,
            errorMessage: ''
          })),
          errorMessage: ''
        }
      });
    }
    clearGetUserResponse();
  }

  if (getUserError) {
    if (getUserError.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (getUserError.response?.status === HttpStatus.NOT_FOUND) {
      openSnackbar('User Not Found', 'error');
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    clearGetUserError();
    onClose();
  }

  const editUser = useUpdate(`${apiData.apiUrl}/users/${id}`);

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
    const updatedRolesValue = form.roles.value as {
      value: string;
      errorMessage: string;
    }[];
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
    const updatedRolesValue = form.roles.value as {
      value: string;
      errorMessage: string;
    }[];
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

  const handleEditUserButtonClick = () => {
    if (!checkForErrors()) {
      if (!checkIfValuesChanged()) {
        onClose();
        return;
      }
      const request = {
        DisplayName: (form.displayName.value as string).trim(),
        Roles: (form.roles.value as IFormValue[]).map((r) => r.value)
      };
      editUser.update(request, apiData.requestConfig);
    }
  };

  if (editUser.response) {
    if (editUser.response.status === HttpStatus.OK) {
      openSnackbar('User Updated Successfully');
      onClose();
    }
    editUser.clearResponse();
  }

  if (editUser.error) {
    if (editUser.error.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (
      editUser.error.response?.status === HttpStatus.UNPROCESSABLE_ENTITY
    ) {
      mapApiErrors(editUser.error.response.data as IApiErrorResponse[]);
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    editUser.clearError();
  }

  const checkForErrors = () => {
    let hasErrors = false;
    const validationErrors = [];

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
      user?.displayName !== form.displayName.value ||
      (form.roles.value as IFormValue[]).map((r) => r.value) !== user?.roles
    );
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
      title='Edit User'
      isOpen
      onClose={onClose}
      onSubmit={handleEditUserButtonClick}
      submitButtonText='Edit'
      submitButtonLoading={editUser.loading}
    >
      {getUserLoading ? (
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
                label=''
                name={`role[${index}]`}
                placeholder='Select Role'
                inputSize='sm'
                value={role.value}
                options={getRoleOptions(role.value)}
                onChange={onRoleChange}
                error={role.errorMessage !== ''}
                helperText={role.errorMessage}
                removeMargin
              />
            ))}
          </Repeater>
        </Stack>
      )}
    </FormDialog>
  );
};

interface IEditUserDialogProps {
  onClose: () => void;
  id: number;
}

export default EditUserDialog;
