import { TableHead as MuiTableHead, TableHeadProps } from '@mui/material';

const TableHeader = (props: ITableBodyProps) => {
  const { children, ...rest } = props;
  return <MuiTableHead {...rest}>{children}</MuiTableHead>;
};

interface ITableBodyProps extends TableHeadProps {}

export default TableHeader;
