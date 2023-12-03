import { SyntheticEvent } from 'react';
import {
  IconButton as MaterialIconButton,
  IconButtonOwnProps,
  styled
} from '@mui/material';
import { Tooltip } from '..';

const defaultSize = 'small';
const defaultColorType = 'main';

const IconButtonBase = styled(MaterialIconButton, {
  shouldForwardProp: (prop) => prop !== 'colorType'
})<{ colorType?: string }>(({ theme, colorType }) => ({
  'color':
    colorType === 'main'
      ? theme.sour.colors.purple.main
      : theme.sour.colors.grey.dark,
  '&:hover': { backgroundColor: theme.sour.colors.purple.light },
  '&:active': { backgroundColor: theme.sour.colors.purple.medium }
}));

const IconButton = (props: IIconButtonProps) => {
  const {
    size = defaultSize,
    colorType = defaultColorType,
    tooltipText,
    disabled,
    children,
    ...rest
  } = props;
  return disabled ? (
    <IconButtonBase
      size={size}
      colorType={colorType}
      disabled
      disableRipple
      {...rest}
    >
      {children}
    </IconButtonBase>
  ) : (
    <Tooltip title={tooltipText}>
      <IconButtonBase size={size} colorType={colorType} disableRipple {...rest}>
        {children}
      </IconButtonBase>
    </Tooltip>
  );
};

interface IIconButtonProps extends IconButtonOwnProps {
  size?: 'small' | 'medium' | 'large';
  colorType?: 'main' | 'dark';
  tooltipText?: string;
  disabled?: boolean;
  onClick?: (event: SyntheticEvent<Element>) => void | (() => void);
}

export default IconButton;
