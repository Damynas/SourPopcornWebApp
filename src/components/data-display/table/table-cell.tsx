import {
  TableCell as MuiTableCell,
  TableCellProps,
  styled
} from '@mui/material';

const CellBase = styled(MuiTableCell)(({ width }) => ({
  ...(width && {
    minWidth: width
  })
}));

const HeaderCell = styled(CellBase)(({ theme }) => ({
  color: theme.sour.colors.purple.main,
  backgroundColor: theme.sour.colors.grey.dark,
  borderColor: theme.sour.colors.purple.main
}));

const BodyCell = styled(CellBase)(({ theme }) => ({
  color: theme.sour.colors.grey.dark,
  borderColor: theme.sour.colors.purple.main,
  fontWeight: 'bold'
}));

const FooterCell = styled(CellBase)(({ theme }) => ({
  color: theme.sour.colors.grey.dark,
  fontWeight: 'bold',
  borderBottom: 'none'
}));

const TableCell = (props: ITableCellProps) => {
  const { variant, children, ...rest } = props;
  switch (variant) {
    case 'head':
      return (
        <HeaderCell size='small' {...rest}>
          {children}
        </HeaderCell>
      );
    case 'body':
      return (
        <BodyCell size='small' {...rest}>
          {children}
        </BodyCell>
      );
    case 'footer':
      return (
        <FooterCell size='small' {...rest}>
          {children}
        </FooterCell>
      );
    default:
      throw new Error(`Unsupported table cell variant: ${variant}`);
  }
};

interface ITableCellProps extends TableCellProps {}

export default TableCell;
