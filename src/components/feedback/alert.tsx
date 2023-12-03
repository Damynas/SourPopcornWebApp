import {
  AlertProps,
  Alert as MaterialAlert,
  Theme,
  styled
} from '@mui/material';
import { ForwardedRef, forwardRef } from 'react';

const getColorBySeverity = (theme: Theme, severity?: string) => {
  switch (severity) {
    case 'success':
      return theme.sour.colors.green.main;
    case 'warning':
      return theme.sour.colors.orange.main;
    case 'error':
      return theme.sour.colors.red.main;
    case 'info':
      return theme.sour.colors.blue.main;
  }
};

const StyledAlert = styled(MaterialAlert)(({ theme, severity }) => ({
  'backgroundColor': theme.sour.colors.grey.dark,
  'borderColor': getColorBySeverity(theme, severity),
  'color': getColorBySeverity(theme, severity),
  '& .MuiAlert-icon': {
    color: getColorBySeverity(theme, severity)
  }
}));

const AlertBase = (props: IAlertProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { message, ...rest } = props;
  return (
    <StyledAlert {...rest} elevation={6} ref={ref} variant='outlined'>
      {message}
    </StyledAlert>
  );
};

const Alert = forwardRef<HTMLDivElement, IAlertProps>(AlertBase);

interface IAlertProps extends AlertProps {
  message: string;
}

export default Alert;
