import { TableBody as MuiTableBody, TableBodyProps } from '@mui/material';

const TableBody = (props: ITableBodyProps) => {
  const { children, ...rest } = props;
  return <MuiTableBody {...rest}>{children}</MuiTableBody>;
};

interface ITableBodyProps extends TableBodyProps {
  type?: string;
}

export default TableBody;
