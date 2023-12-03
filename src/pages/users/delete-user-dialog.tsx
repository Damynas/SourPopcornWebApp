import { useContext } from 'react';
import { ConfirmDialog } from '../../components';
import { DataContext, type IDataContext, useRemove } from '../../utils';
import { HttpStatus } from '../../constants';

const confirmationMessage = 'Are you sure that you want to delete this user?';

const DeleteUserDialog = (props: IDeleteUserDialogProps) => {
  const { onClose, id } = props;

  const { apiData, openSnackbar } = useContext(DataContext) as IDataContext;

  const deleteUser = useRemove(`${apiData.apiUrl}/users/${id}`);

  const handleDeleteUserButtonClick = () => {
    deleteUser.remove(apiData.requestConfig);
  };

  if (deleteUser.response) {
    if (deleteUser.response.status === HttpStatus.NO_CONTENT) {
      openSnackbar('User Deleted Successfully');
      onClose();
    }
    deleteUser.clearResponse();
  }

  if (deleteUser.error) {
    if (deleteUser.error.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (deleteUser.response?.status === HttpStatus.NOT_FOUND) {
      openSnackbar('User Not Found', 'error');
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    deleteUser.clearError();
    onClose();
  }

  return (
    <ConfirmDialog
      isOpen
      message={confirmationMessage}
      onConfirm={handleDeleteUserButtonClick}
      onClose={onClose}
    />
  );
};

interface IDeleteUserDialogProps {
  onClose: () => void;
  id: number;
}

export default DeleteUserDialog;
