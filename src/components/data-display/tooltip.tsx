import {
  Tooltip as MaterialTooltip,
  tooltipClasses,
  TooltipProps,
  styled
} from '@mui/material';

const defaultDelay = 200;

const TooltipBase = styled(({ className, ...props }: ITooltipProps) => (
  <MaterialTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 100,
    backgroundColor: theme.sour.colors.purple.main
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.sour.colors.main
  }
}));

const Tooltip = (props: ITooltipProps) => {
  const { children, ...rest } = props;
  return (
    <TooltipBase
      enterDelay={defaultDelay}
      leaveDelay={defaultDelay}
      arrow
      {...rest}
    >
      {children}
    </TooltipBase>
  );
};

interface ITooltipProps extends TooltipProps {}

export default Tooltip;
