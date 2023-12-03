import { Children, cloneElement, type ReactElement } from 'react';
import { Box, Stack, Typography, styled } from '@mui/material';
import { Button, IconButton } from '.';
import DeleteIcon from '@mui/icons-material/Delete';

const Title = styled(Typography)(({ theme }) => ({
  color: theme.sour.colors.purple.main,
  fontWeight: 'bold',
  fontSize: '1rem'
}));

const Text = styled(Typography)(({ theme }) => ({
  color: theme.sour.colors.purple.main,
  fontWeight: 'bold',
  fontSize: '0.9rem'
}));

const Repeater = (props: IRepeaterProps) => {
  const {
    title,
    children,
    onAdd,
    onRemove,
    addButtonVisible = true,
    addButtonText = 'Add',
    maxItemCount = 5,
    firstItemRequired,
    firstItemReadOnly
  } = props;

  return (
    <Stack
      direction='column'
      display='flex'
      justifyContent='space-between'
      margin='0.5rem'
      spacing={2}
    >
      <Title>{title}</Title>
      {Children.count(children) > 0 ? (
        Children.map(children, (child, index) => (
          <Stack
            key={index}
            direction='row'
            display='flex'
            justifyContent='space-between'
            alignItems={
              'error' in child.props && child.props.error
                ? 'flex-start'
                : 'center'
            }
            paddingLeft='0.5rem'
            spacing={2}
          >
            {index === 0 && firstItemReadOnly
              ? cloneElement(child, { readOnly: true })
              : child}
            {!(index === 0 && firstItemRequired) && (
              <IconButton
                colorType='main'
                tooltipText='Delete'
                onClick={() => onRemove(index)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Stack>
        ))
      ) : (
        <Box
          display='flex'
          justifyContent='flex-start'
          alignItems='center'
          margin='0.5rem'
          paddingLeft='0.5rem'
        >
          <Text>No Items</Text>
        </Box>
      )}
      {addButtonVisible && Children.count(children) < maxItemCount && (
        <Box
          display='flex'
          justifyContent='flex-start'
          alignItems='center'
          margin='0.5rem'
        >
          <Button variant='outlined' onClick={onAdd}>
            {addButtonText}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

interface IRepeaterProps {
  title: string;
  children: ReactElement[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  addButtonVisible?: boolean;
  addButtonText?: string;
  maxItemCount?: number;
  firstItemRequired?: boolean;
  firstItemReadOnly?: boolean;
}

export default Repeater;
