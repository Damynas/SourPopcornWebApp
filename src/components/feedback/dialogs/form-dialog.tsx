import { ReactElement } from 'react';
import { Dialog } from '.';
import { Button } from '../..';
import { useTheme } from '@mui/material';

const FormDialog = (props: IFormDialogProps) => {
  const {
    title,
    isOpen,
    errorMessage,
    closeButtonText = 'Cancel',
    submitButtonText = 'Submit',
    submitButtonLoading,
    onClose,
    onSubmit,
    children
  } = props;
  const theme = useTheme();
  return (
    <Dialog
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      closeButtonText={closeButtonText}
      content={children}
      actions={
        <Button onClick={onSubmit} loading={submitButtonLoading}>
          {submitButtonText}
        </Button>
      }
      message={errorMessage}
      messageColor={theme.sour.colors.red.main}
    />
  );
};

interface IFormDialogProps {
  title: string;
  isOpen: boolean;
  errorMessage?: string;
  closeButtonText?: string;
  submitButtonText?: string;
  submitButtonLoading?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children?: ReactElement;
}

export default FormDialog;
