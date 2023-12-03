import { TableRow as MuiTableRow, TableRowProps } from '@mui/material';

const TableRow = (props: ITableBodyProps) => {
  const { children, ...rest } = props;
  return <MuiTableRow {...rest}>{children}</MuiTableRow>;
};

interface ITableBodyProps extends TableRowProps {}

export default TableRow;
