import { useContext } from 'react';
import { ConfirmDialog } from '../../components';
import { DataContext, type IDataContext, useRemove } from '../../utils';
import { HttpStatus } from '../../constants';

const confirmationMessage = 'Are you sure that you want to delete this movie?';

const DeleteMovieDialog = (props: IDeleteMovieDialogProps) => {
  const { id, onClose, onDeleted } = props;

  const { apiData, openSnackbar } = useContext(DataContext) as IDataContext;

  const deleteMovie = useRemove(`${apiData.apiUrl}/movies/${id}`);

  const handleDeleteMovieButtonClick = () => {
    deleteMovie.remove(apiData.requestConfig);
  };

  if (deleteMovie.response) {
    if (deleteMovie.response.status === HttpStatus.NO_CONTENT) {
      openSnackbar('Movie Deleted Successfully');
      onDeleted();
    }
    deleteMovie.clearResponse();
  }

  if (deleteMovie.error) {
    if (deleteMovie.error.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (deleteMovie.response?.status === HttpStatus.NOT_FOUND) {
      openSnackbar('Movie Not Found', 'error');
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    deleteMovie.clearError();
    onClose();
  }

  return (
    <ConfirmDialog
      isOpen
      message={confirmationMessage}
      onConfirm={handleDeleteMovieButtonClick}
      onClose={onClose}
    />
  );
};

interface IDeleteMovieDialogProps {
  id: number;
  onClose: () => void;
  onDeleted: () => void;
}

export default DeleteMovieDialog;
