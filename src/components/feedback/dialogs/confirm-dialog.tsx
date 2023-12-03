import { Dialog } from '.';
import { Button } from '../..';
import { Typography, styled, useTheme } from '@mui/material';

const Message = styled(Typography)(() => ({
  padding: '0.5rem'
}));

const ConfirmDialog = (props: IConfirmDialogProps) => {
  const {
    isOpen,
    message,
    closeButtonText = 'Cancel',
    confirmButtonText = 'Confirm',
    confirmButtonLoading,
    onClose,
    onConfirm
  } = props;
  const theme = useTheme();
  return (
    <Dialog
      title='Confirm'
      isOpen={isOpen}
      onClose={onClose}
      closeButtonText={closeButtonText}
      content={
        <Message color={theme.sour.colors.purple.main}>{message}</Message>
      }
      actions={
        <Button onClick={onConfirm} loading={confirmButtonLoading}>
          {confirmButtonText}
        </Button>
      }
    />
  );
};

interface IConfirmDialogProps {
  isOpen: boolean;
  message: string;
  closeButtonText?: string;
  confirmButtonText?: string;
  confirmButtonLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default ConfirmDialog;
