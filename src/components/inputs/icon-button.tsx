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

const OverlayText = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  color: theme.sour.colors.purple.main,
  fontSize: '0.75rem'
}));

const handleButtonClick = (
  event: SyntheticEvent<Element>,
  onClick?: (event: SyntheticEvent<Element>) => void | (() => void)
) => {
  event.stopPropagation();
  if (onClick) {
    onClick(event);
  }
};

const IconButton = (props: IIconButtonProps) => {
  const {
    size = defaultSize,
    colorType = defaultColorType,
    tooltipText,
    disabled,
    onClick,
    overlayText,
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
      {overlayText && <OverlayText>{overlayText}</OverlayText>}
    </IconButtonBase>
  ) : (
    <Tooltip title={tooltipText}>
      <IconButtonBase
        size={size}
        colorType={colorType}
        onClick={(event) => handleButtonClick(event, onClick)}
        disableRipple
        {...rest}
      >
        {children}
        {overlayText && <OverlayText>{overlayText}</OverlayText>}
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
  overlayText?: string;
}

export default IconButton;
