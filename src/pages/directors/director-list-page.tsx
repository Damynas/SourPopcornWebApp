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
import { HttpStatus, PageName, UserRole } from '../../constants';
import {
  DataContext,
  type IDataContext,
  useFind,
  formatDate,
  hasRole
} from '../../utils';
import { type IDirectorDto } from '../../common';
import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CreateDirectorDialog from './create-director-dialog';
import EditDirectorDialog from './edit-director-dialog';
import DeleteDirectorDialog from './delete-director-dialog';

const DirectorListPage = () => {
  const { apiData, user, openSnackbar } = useContext(
    DataContext
  ) as IDataContext;

  const [directors, setDirectors] = useState<IDirectorDto[]>([]);
  const [directorId, setDirectorId] = useState<number | null>(null);

  const {
    find: getDirectors,
    loading: getDirectorsLoading,
    response: getDirectorsResponse,
    error: getDirectorsError,
    clearResponse: clearGetDirectorsResponse,
    clearError: clearGetDirectorsError
  } = useFind(`${apiData.apiUrl}/directors`);

  useEffect(() => {
    getDirectors(apiData.requestConfig);
  }, [apiData.requestConfig, getDirectors]);

  if (getDirectorsResponse) {
    if (getDirectorsResponse.status === HttpStatus.OK) {
      setDirectors(getDirectorsResponse.data.resource);
    }
    clearGetDirectorsResponse();
  }

  if (getDirectorsError) {
    if (getDirectorsError.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    clearGetDirectorsError();
  }

  const [createDirectorFormDialogOpen, setCreateDirectorFormDialogOpen] =
    useState<boolean>(false);
  const changeCreateDirectorFormDialogState = () => {
    setCreateDirectorFormDialogOpen(!createDirectorFormDialogOpen);
  };

  const onCreateButtonClick = () => {
    changeCreateDirectorFormDialogState();
  };

  const onCreateDirectorFormDialogClose = () => {
    changeCreateDirectorFormDialogState();
  };

  const onDirectorCreated = (director: IDirectorDto) => {
    setDirectors([...directors, director]);
    onCreateDirectorFormDialogClose();
  };

  const [editDirectorFormDialogOpen, setEditDirectorFormDialogOpen] =
    useState<boolean>(false);
  const changeEditDirectorFormDialogState = () => {
    setEditDirectorFormDialogOpen(!editDirectorFormDialogOpen);
  };

  const onEditButtonClick = (id: number) => {
    setDirectorId(id);
    changeEditDirectorFormDialogState();
  };

  const onEditDirectorFormDialogClose = () => {
    setDirectorId(null);
    changeEditDirectorFormDialogState();
  };

  const onDirectorEdited = (director: IDirectorDto) => {
    const updatedDirectors = directors.map((u) =>
      u.id === director.id ? director : u
    );
    setDirectors(updatedDirectors);
    onEditDirectorFormDialogClose();
  };

  const [deleteDirectorConfirmDialogOpen, setDeleteDirectorConfirmDialogOpen] =
    useState<boolean>(false);
  const changeDeleteDirectorConfirmDialogState = () => {
    setDeleteDirectorConfirmDialogOpen(!deleteDirectorConfirmDialogOpen);
  };

  const onDeleteButtonClick = (id: number) => {
    setDirectorId(id);
    changeDeleteDirectorConfirmDialogState();
  };

  const onDeleteDirectorConfirmDialogClose = () => {
    setDirectorId(null);
    changeDeleteDirectorConfirmDialogState();
  };

  const onDirectorDeleted = () => {
    const updatedDirectors = directors.filter((u) => u.id !== directorId);
    setDirectors(updatedDirectors);
    onDeleteDirectorConfirmDialogClose();
  };

  const renderHeader = () => {
    return (
      <TableHeader>
        <TableRow>
          <TableCell variant='head' align='left' width='200px'>
            Name
          </TableCell>
          <TableCell variant='head' align='left' width='200px'>
            Country
          </TableCell>
          <TableCell variant='head' align='right' width='100px'>
            Born On
          </TableCell>
          <TableCell variant='head' align='right' width='100px'>
            Created On
          </TableCell>
          <TableCell variant='head' align='right' width='100px'>
            Modified On
          </TableCell>
          {hasRole(user, UserRole.MODERATOR) && (
            <TableCell variant='head' align='right' width='100px'></TableCell>
          )}
        </TableRow>
      </TableHeader>
    );
  };

  const renderBody = () => {
    return (
      <TableBody key='count-rows'>
        {directors.map((director) => (
          <TableRow key={director.id}>
            <TableCell variant='body' align='left' width='200px'>
              {director.name}
            </TableCell>
            <TableCell variant='body' align='left' width='200px'>
              {director.country}
            </TableCell>
            <TableCell variant='body' align='right' width='100px'>
              {formatDate(director.bornOn)}
            </TableCell>
            <TableCell variant='body' align='right' width='100px'>
              {formatDate(director.createdOn)}
            </TableCell>
            <TableCell variant='body' align='right' width='100px'>
              {formatDate(director.modifiedOn)}
            </TableCell>
            {hasRole(user, UserRole.MODERATOR) && renderActions(director.id)}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  const renderActions = (directorId: number) => {
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
            onClick={() => onEditButtonClick(directorId)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            colorType='dark'
            tooltipText='Delete'
            onClick={() => onDeleteButtonClick(directorId)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </TableCell>
    );
  };

  return (
    <Page authenticated selectedPage={PageName.DIRECTORS}>
      <Table
        loading={getDirectorsLoading}
        createButtonVisible={hasRole(user, UserRole.MODERATOR)}
        createButtonText='Create Director'
        onCreateButtonClick={onCreateButtonClick}
      >
        {renderHeader()}
        {renderBody()}
        {createDirectorFormDialogOpen && (
          <CreateDirectorDialog
            onClose={onCreateDirectorFormDialogClose}
            onCreated={onDirectorCreated}
          />
        )}
        {editDirectorFormDialogOpen && directorId && (
          <EditDirectorDialog
            id={directorId}
            onClose={onEditDirectorFormDialogClose}
            onEdited={onDirectorEdited}
          />
        )}
        {deleteDirectorConfirmDialogOpen && directorId && (
          <DeleteDirectorDialog
            id={directorId}
            onClose={onDeleteDirectorConfirmDialogClose}
            onDeleted={onDirectorDeleted}
          />
        )}
      </Table>
    </Page>
  );
};

export default DirectorListPage;
