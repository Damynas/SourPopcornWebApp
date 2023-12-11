import { TableRow as MuiTableRow, TableRowProps, styled } from '@mui/material';

const TableRowBase = styled(MuiTableRow)(({ onClick }) => ({
  ...(onClick && {
    cursor: 'pointer'
  })
}));

const TableRow = (props: ITableBodyProps) => {
  const { children, ...rest } = props;
  return (
    <TableRowBase hover {...rest}>
      {children}
    </TableRowBase>
  );
};

interface ITableBodyProps extends TableRowProps {}

export default TableRow;
