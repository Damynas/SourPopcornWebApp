import { useContext } from 'react';
import { ConfirmDialog } from '../../components';
import { DataContext, type IDataContext, useRemove } from '../../utils';
import { HttpStatus } from '../../constants';

const confirmationMessage =
  'Are you sure that you want to delete this director?';

const DeleteDirectorDialog = (props: IDeleteDirectorDialogProps) => {
  const { id, onClose, onDeleted } = props;

  const { apiData, openSnackbar } = useContext(DataContext) as IDataContext;

  const deleteDirector = useRemove(`${apiData.apiUrl}/directors/${id}`);

  const handleDeleteDirectorButtonClick = () => {
    deleteDirector.remove(apiData.requestConfig);
  };

  if (deleteDirector.response) {
    if (deleteDirector.response.status === HttpStatus.NO_CONTENT) {
      openSnackbar('Director Deleted Successfully');
      onDeleted();
    }
    deleteDirector.clearResponse();
  }

  if (deleteDirector.error) {
    if (deleteDirector.error.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (deleteDirector.response?.status === HttpStatus.NOT_FOUND) {
      openSnackbar('Director Not Found', 'error');
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    deleteDirector.clearError();
    onClose();
  }

  return (
    <ConfirmDialog
      isOpen
      message={confirmationMessage}
      onConfirm={handleDeleteDirectorButtonClick}
      onClose={onClose}
    />
  );
};

interface IDeleteDirectorDialogProps {
  id: number;
  onClose: () => void;
  onDeleted: () => void;
}

export default DeleteDirectorDialog;
