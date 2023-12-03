import {
  Popover as MaterialPopover,
  popoverClasses,
  PopoverProps,
  styled
} from '@mui/material';

const PopoverBase = styled((props: PopoverProps) => (
  <MaterialPopover {...props} />
))(({ theme }) => ({
  [`& .${popoverClasses.paper}`]: {
    color: theme.sour.colors.purple.main,
    backgroundColor: theme.sour.colors.grey.dark,
    padding: '0.25rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const Popover = (props: IPopoverProps) => {
  const { open, anchor, children, ...rest } = props;
  return (
    <PopoverBase
      open={open}
      anchorEl={anchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      {...rest}
    >
      {children}
    </PopoverBase>
  );
};

interface IPopoverProps extends PopoverProps {
  anchor: Element | null;
}

export default Popover;
