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
import { type IDirectorDto, type IMovieDto } from '../../common';
import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CreateMovieDialog from './create-movie-dialog';
import EditMovieDialog from './edit-movie-dialog';
import DeleteMovieDialog from './delete-movie-dialog';
import { useNavigate } from 'react-router-dom';

const MovieListPage = () => {
  const { apiData, user, openSnackbar } = useContext(
    DataContext
  ) as IDataContext;
  const navigate = useNavigate();

  const [movies, setMovies] = useState<IMovieDto[]>([]);
  const [movieId, setMovieId] = useState<number | null>(null);

  const {
    find: getMovies,
    loading: getMoviesLoading,
    response: getMoviesResponse,
    error: getMoviesError,
    clearResponse: clearGetMoviesResponse,
    clearError: clearGetMoviesError
  } = useFind(`${apiData.apiUrl}/movies`);

  useEffect(() => {
    getMovies(apiData.requestConfig);
  }, [apiData.requestConfig, getMovies]);

  if (getMoviesResponse) {
    if (getMoviesResponse.status === HttpStatus.OK) {
      setMovies(getMoviesResponse.data.resource);
    }
    clearGetMoviesResponse();
  }

  if (getMoviesError) {
    if (getMoviesError.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    clearGetMoviesError();
  }

  const [directors, setDirectors] = useState<IDirectorDto[]>([]);

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

  const [createMovieFormDialogOpen, setCreateMovieFormDialogOpen] =
    useState<boolean>(false);
  const changeCreateMovieFormDialogState = () => {
    setCreateMovieFormDialogOpen(!createMovieFormDialogOpen);
  };

  const onCreateButtonClick = () => {
    changeCreateMovieFormDialogState();
  };

  const onCreateMovieFormDialogClose = () => {
    changeCreateMovieFormDialogState();
    getMovies(apiData.requestConfig);
  };

  const [editMovieFormDialogOpen, setEditMovieFormDialogOpen] =
    useState<boolean>(false);
  const changeEditMovieFormDialogState = () => {
    setEditMovieFormDialogOpen(!editMovieFormDialogOpen);
  };

  const onEditButtonClick = (id: number) => {
    setMovieId(id);
    changeEditMovieFormDialogState();
  };

  const onEditMovieFormDialogClose = () => {
    setMovieId(null);
    changeEditMovieFormDialogState();
    getMovies(apiData.requestConfig);
  };

  const [deleteMovieConfirmDialogOpen, setDeleteMovieConfirmDialogOpen] =
    useState<boolean>(false);
  const changeDeleteMovieConfirmDialogState = () => {
    setDeleteMovieConfirmDialogOpen(!deleteMovieConfirmDialogOpen);
  };

  const onDeleteButtonClick = (id: number) => {
    setMovieId(id);
    changeDeleteMovieConfirmDialogState();
  };

  const onDeleteMovieConfirmDialogClose = () => {
    setMovieId(null);
    changeDeleteMovieConfirmDialogState();
    getMovies(apiData.requestConfig);
  };

  const renderHeader = () => {
    return (
      <TableHeader>
        <TableRow>
          <TableCell variant='head' align='left' width='200px'>
            Title
          </TableCell>
          <TableCell variant='head' align='left' width='200px'>
            Description
          </TableCell>
          <TableCell variant='head' align='left' width='200px'>
            Director
          </TableCell>
          <TableCell variant='head' align='right' width='100px'>
            Sour Popcorns
          </TableCell>
          <TableCell variant='head' align='right' width='100px'>
            Released On
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
        {movies.map((movie) => (
          <TableRow
            key={movie.id}
            onClick={() => navigate(`/movies/${movie.id}`)}
          >
            <TableCell variant='body' align='left' width='200px'>
              {movie.title}
            </TableCell>
            <TableCell variant='body' align='left' width='200px'>
              {movie.description}
            </TableCell>
            <TableCell variant='body' align='left' width='200px'>
              {
                directors.find((director) => director.id === movie.directorId)
                  ?.name
              }
            </TableCell>
            <TableCell variant='body' align='right' width='100px'>
              {movie.sourPopcorns}
            </TableCell>
            <TableCell variant='body' align='right' width='100px'>
              {formatDate(movie.releasedOn)}
            </TableCell>
            <TableCell variant='body' align='right' width='100px'>
              {formatDate(movie.createdOn)}
            </TableCell>
            <TableCell variant='body' align='right' width='100px'>
              {formatDate(movie.modifiedOn)}
            </TableCell>
            {hasRole(user, UserRole.MODERATOR) && renderActions(movie.id)}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  const renderActions = (movieId: number) => {
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
            onClick={() => onEditButtonClick(movieId)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            colorType='dark'
            tooltipText='Delete'
            onClick={() => onDeleteButtonClick(movieId)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </TableCell>
    );
  };

  return (
    <Page authenticated selectedPage={PageName.MOVIES}>
      <Table
        loading={getMoviesLoading || getDirectorsLoading}
        createButtonVisible={hasRole(user, UserRole.MODERATOR)}
        createButtonText='Create Movie'
        onCreateButtonClick={onCreateButtonClick}
      >
        {renderHeader()}
        {renderBody()}
        {createMovieFormDialogOpen && (
          <CreateMovieDialog
            directors={directors}
            onClose={onCreateMovieFormDialogClose}
          />
        )}
        {editMovieFormDialogOpen && movieId && (
          <EditMovieDialog
            id={movieId}
            directors={directors}
            onClose={onEditMovieFormDialogClose}
          />
        )}
        {deleteMovieConfirmDialogOpen && movieId && (
          <DeleteMovieDialog
            id={movieId}
            onClose={onDeleteMovieConfirmDialogClose}
          />
        )}
      </Table>
    </Page>
  );
};

export default MovieListPage;
