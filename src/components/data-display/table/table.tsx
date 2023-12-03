import { Children, ReactElement, isValidElement } from 'react';
import {
  Box,
  Table as MuiTable,
  Skeleton,
  Stack,
  TableContainer,
  TableProps,
  Typography,
  styled
} from '@mui/material';
import Pluralize from 'pluralize';
import { Button } from '../..';

const Container = styled(Stack)(() => ({
  minWidth: '80%',
  margin: '3rem'
}));

const FooterText = styled(Typography)(({ theme }) => ({
  color: theme.sour.colors.grey.dark,
  fontWeight: 'bold'
}));

const Table = (props: ITableProps) => {
  const {
    loading = false,
    createButtonDisabled = false,
    createButtonVisible = false,
    createButtonText = 'Create',
    onCreateButtonClick,
    children,
    ...rest
  } = props;
  const tableBody = Children.toArray(children).find(
    (child) => isValidElement(child) && child.key === '.$count-rows'
  ) as ReactElement;
  const rowCount = tableBody ? Children.count(tableBody.props.children) : null;
  return (
    <Container>
      {createButtonVisible && (
        <Box marginBottom='1rem'>
          <Button
            variant='outlined'
            onClick={onCreateButtonClick}
            disabled={createButtonDisabled || loading}
          >
            {createButtonText}
          </Button>
        </Box>
      )}
      <TableContainer>
        {loading ? (
          <>
            <Skeleton animation='wave' />
            <Skeleton animation='wave' />
            <Skeleton animation='wave' />
          </>
        ) : (
          <MuiTable stickyHeader {...rest}>
            {children}
          </MuiTable>
        )}
      </TableContainer>
      {!loading && rowCount !== null && (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          margin='0.5rem'
        >
          <FooterText>{Pluralize('Row', rowCount, true)}</FooterText>
        </Box>
      )}
    </Container>
  );
};

interface ITableProps extends TableProps {
  loading?: boolean;
  createButtonDisabled?: boolean;
  createButtonVisible?: boolean;
  createButtonText?: string;
  onCreateButtonClick?: () => void;
}

export default Table;
