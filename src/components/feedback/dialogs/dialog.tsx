import { ReactElement } from 'react';
import {
  Dialog as MaterialDialog,
  DialogTitle as MaterialDialogTitle,
  DialogContent as MaterialDialogContent,
  DialogActions as MaterialDialogActions,
  dialogClasses,
  DialogProps,
  styled,
  Stack,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton } from '../..';

const DialogBase = styled((props: DialogProps) => (
  <MaterialDialog {...props} />
))(({ theme }) => ({
  [`& .${dialogClasses.paper}`]: {
    backgroundColor: theme.sour.colors.grey.dark,
    minWidth: '30rem',
    boxShadow: `0rem 0rem 0.3rem 0.05rem ${theme.sour.colors.grey.main}`
  }
}));

const DialogTitle = styled(MaterialDialogTitle)(({ theme }) => ({
  color: theme.sour.colors.purple.main,
  fontSize: '1.5rem',
  padding: 0
}));

const DialogContent = styled(MaterialDialogContent)(({ theme }) => ({
  borderColor: theme.sour.colors.purple.main,
  color: theme.sour.colors.purple.main,
  padding: '0.5rem'
}));

const DialogActions = styled(MaterialDialogActions, {
  shouldForwardProp: (prop) => prop !== 'message'
})<{ message?: string }>(({ message }) => ({
  justifyContent: message ? 'space-between' : 'flex-end',
  padding: 0
}));

const Container = styled(Stack)(() => ({
  padding: '0.5rem'
}));

const Message = styled(Typography)(() => ({
  padding: '0.5rem'
}));

const Dialog = (props: IDialogProps) => {
  const {
    title,
    isOpen,
    content,
    actions,
    closeButtonText = 'Close',
    onClose,
    message,
    messageColor
  } = props;
  return (
    <DialogBase onClose={onClose} open={isOpen}>
      <Container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        spacing={0.5}
      >
        <DialogTitle>{title}</DialogTitle>
        <IconButton onClick={onClose}>{<CloseIcon />}</IconButton>
      </Container>
      <DialogContent dividers>{content}</DialogContent>
      <DialogActions message={message}>
        {message && <Message color={messageColor}>{message}</Message>}
        <Container
          direction='row'
          justifyContent='flex-start'
          alignItems='center'
          spacing={1}
        >
          {actions}
          <Button variant='outlined' onClick={onClose}>
            {closeButtonText}
          </Button>
        </Container>
      </DialogActions>
    </DialogBase>
  );
};

interface IDialogProps {
  title: string;
  isOpen: boolean;
  content?: ReactElement;
  actions?: ReactElement;
  closeButtonText?: string;
  onClose: () => void;
  message?: string;
  messageColor?: string;
}

export default Dialog;
