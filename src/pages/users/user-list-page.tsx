import { useContext, useEffect, useState } from 'react';
import {
  IconButton,
  Page,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from '../../components';
import { HttpStatus, PageName } from '../../constants';
import {
  DataContext,
  type IDataContext,
  useFind,
  formatDate
} from '../../utils';
import { type IUserDto } from '../../common';
import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CreateUserDialog from './create-user-dialog';
import EditUserDialog from './edit-user-dialog';
import DeleteUserDialog from './delete-user-dialog';

const UserListPage = () => {
  const { apiData, openSnackbar } = useContext(DataContext) as IDataContext;

  const [users, setUsers] = useState<IUserDto[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const {
    find: getUsers,
    loading: getUsersLoading,
    response: getUsersResponse,
    error: getUsersError,
    clearResponse: clearGetUsersResponse,
    clearError: clearGetUsersError
  } = useFind(`${apiData.apiUrl}/users`);

  useEffect(() => {
    getUsers(apiData.requestConfig);
  }, [apiData.requestConfig, getUsers]);

  if (getUsersResponse) {
    if (getUsersResponse.status === HttpStatus.OK) {
      setUsers(getUsersResponse.data.resource);
    }
    clearGetUsersResponse();
  }

  if (getUsersError) {
    if (getUsersError.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    clearGetUsersError();
  }

  const [createUserFormDialogOpen, setCreateUserFormDialogOpen] =
    useState<boolean>(false);
  const changeCreateUserFormDialogState = () => {
    setCreateUserFormDialogOpen(!createUserFormDialogOpen);
  };

  const onCreateButtonClick = () => {
    changeCreateUserFormDialogState();
  };

  const onCreateUserFormDialogClose = () => {
    changeCreateUserFormDialogState();
    getUsers(apiData.requestConfig);
  };

  const [editUserFormDialogOpen, setEditUserFormDialogOpen] =
    useState<boolean>(false);
  const changeEditUserFormDialogState = () => {
    setEditUserFormDialogOpen(!editUserFormDialogOpen);
  };

  const onEditButtonClick = (id: number) => {
    setUserId(id);
    changeEditUserFormDialogState();
  };

  const onEditUserFormDialogClose = () => {
    setUserId(null);
    changeEditUserFormDialogState();
    getUsers(apiData.requestConfig);
  };

  const [deleteUserConfirmDialogOpen, setDeleteUserConfirmDialogOpen] =
    useState<boolean>(false);
  const changeDeleteUserConfirmDialogState = () => {
    setDeleteUserConfirmDialogOpen(!deleteUserConfirmDialogOpen);
  };

  const onDeleteButtonClick = (id: number) => {
    setUserId(id);
    changeDeleteUserConfirmDialogState();
  };

  const onDeleteUserConfirmDialogClose = () => {
    setUserId(null);
    changeDeleteUserConfirmDialogState();
    getUsers(apiData.requestConfig);
  };

  const renderHeader = () => {
    return (
      <TableHeader>
        <TableRow>
          <TableCell variant='head' align='left' width='200px'>
            Display Name
          </TableCell>
          <TableCell variant='head' align='left' width='200px'>
            Username
          </TableCell>
          <TableCell variant='head' align='left' width='200px'>
            Roles
          </TableCell>
          <TableCell variant='head' align='right' width='100px'>
            Created On
          </TableCell>
          <TableCell variant='head' align='right' width='100px'>
            Modified On
          </TableCell>
          <TableCell variant='head' align='right' width='100px'></TableCell>
        </TableRow>
      </TableHeader>
    );
  };

  const renderBody = () => {
    return (
      <TableBody key='count-rows'>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell variant='body' align='left' width='200px'>
              {user.displayName}
            </TableCell>
            <TableCell variant='body' align='left' width='200px'>
              {user.username}
            </TableCell>
            <TableCell variant='body' align='left' width='200px'>
              {user.roles.join(', ')}
            </TableCell>
            <TableCell variant='body' align='right' width='100px'>
              {formatDate(user.createdOn)}
            </TableCell>
            <TableCell variant='body' align='right' width='100px'>
              {formatDate(user.modifiedOn)}
            </TableCell>
            {renderActions(user.id)}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  const renderActions = (userId: number) => {
    return (
      <TableCell variant='body' align='right' width='100px'>
        <Stack
          direction='row'
          spacing={1}
          display='flex'
          justifyContent='flex-end'
          alignItems='center'
        >
          <IconButton
            colorType='dark'
            tooltipText='Edit'
            onClick={() => onEditButtonClick(userId)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            colorType='dark'
            tooltipText='Delete'
            onClick={() => onDeleteButtonClick(userId)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </TableCell>
    );
  };

  return (
    <Page authenticated selectedPage={PageName.USERS}>
      <Table
        loading={getUsersLoading}
        createButtonVisible
        createButtonText='Create User'
        onCreateButtonClick={onCreateButtonClick}
      >
        {renderHeader()}
        {renderBody()}
        {createUserFormDialogOpen && (
          <CreateUserDialog onClose={onCreateUserFormDialogClose} />
        )}
        {editUserFormDialogOpen && userId && (
          <EditUserDialog id={userId} onClose={onEditUserFormDialogClose} />
        )}
        {deleteUserConfirmDialogOpen && userId && (
          <DeleteUserDialog
            id={userId}
            onClose={onDeleteUserConfirmDialogClose}
          />
        )}
      </Table>
    </Page>
  );
};

export default UserListPage;
