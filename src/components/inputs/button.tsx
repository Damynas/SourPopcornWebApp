import { SyntheticEvent } from 'react';
import {
  Button as MaterialButton,
  ButtonOwnProps,
  styled,
  CircularProgress
} from '@mui/material';
import { Tooltip } from '..';

const defaultVariant = 'contained';
const defaultSize = 'small';

const ButtonBase = styled(MaterialButton, {
  shouldForwardProp: (prop) => prop !== 'loading'
})<{ loading?: boolean }>(({ loading }) => ({
  textTransform: 'none',
  borderRadius: '0.25rem',
  minWidth: '5rem',
  minHeight: '2rem',
  pointerEvents: loading ? 'none' : 'auto'
}));

const TextButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected'
})<{ selected?: boolean }>(({ theme, selected }) => ({
  'color': theme.sour.colors.purple.main,
  'backgroundColor': theme.sour.colors.grey.dark,
  '&:hover': { backgroundColor: theme.sour.colors.purple.light },
  '&:active': { backgroundColor: theme.sour.colors.purple.medium },
  ...(selected && {
    borderBottom: `0.1rem solid ${theme.sour.colors.purple.main}`
  })
}));

const ContainedButton = styled(ButtonBase)(({ theme }) => ({
  'color': theme.sour.colors.grey.dark,
  'backgroundColor': theme.sour.colors.purple.main,
  '&:hover': { backgroundColor: theme.sour.colors.purple.medium },
  '&:active': { backgroundColor: theme.sour.colors.purple.dark }
}));

const OutlinedButton = styled(ButtonBase)(({ theme }) => ({
  'color': theme.sour.colors.purple.main,
  'borderColor': theme.sour.colors.purple.main,
  'backgroundColor': theme.sour.colors.grey.dark,
  '&:hover': {
    backgroundColor: theme.sour.colors.purple.light,
    borderColor: theme.sour.colors.purple.medium
  },
  '&:active': {
    backgroundColor: theme.sour.colors.purple.medium,
    borderColor: theme.sour.colors.purple.medium
  }
}));

const PurpleLoader = styled(CircularProgress)(({ theme }) => ({
  color: theme.sour.colors.purple.main
}));

const GreyLoader = styled(CircularProgress)(({ theme }) => ({
  color: theme.sour.colors.grey.dark
}));

const renderButton = (buttonProps: IButtonProps) => {
  const {
    variant = defaultVariant,
    size = defaultSize,
    selected,
    children,
    loading,
    ...rest
  } = buttonProps;
  switch (variant) {
    case 'text':
      return (
        <TextButton
          variant={variant}
          size={size}
          selected={selected}
          loading={loading}
          disableRipple
          disableElevation
          {...rest}
        >
          {loading ? <PurpleLoader size='1rem' /> : children}
        </TextButton>
      );
    case 'contained':
      return (
        <ContainedButton
          variant={variant}
          size={size}
          loading={loading}
          disableRipple
          disableElevation
          {...rest}
        >
          {loading ? <GreyLoader size='1rem' /> : children}
        </ContainedButton>
      );
    case 'outlined':
      return (
        <OutlinedButton
          variant={variant}
          size={size}
          loading={loading}
          disableRipple
          disableElevation
          {...rest}
        >
          {loading ? <PurpleLoader size='1rem' /> : children}
        </OutlinedButton>
      );
    default:
      throw new Error(`Unsupported button variant: ${variant}`);
  }
};

const Button = (props: IButtonProps) => {
  const { tooltipText, disabled, ...rest } = props;
  return disabled ? (
    renderButton({ disabled, ...(rest as IButtonProps) })
  ) : (
    <Tooltip title={tooltipText}>
      {renderButton({ ...(rest as IButtonProps) })}
    </Tooltip>
  );
};

interface IButtonProps extends ButtonOwnProps {
  tooltipText?: string;
  selected?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: SyntheticEvent<Element>) => void;
}

export default Button;
