import { Stack, Typography, styled } from '@mui/material';
import { IconButton } from '.';
import GradeIcon from '@mui/icons-material/Grade';

const defaultMaxValue = 5;

const Star = styled(GradeIcon, {
  shouldForwardProp: (prop) => prop !== 'index' && prop !== 'value'
})<{ index: number; value: number }>(({ theme, index, value }) => ({
  color:
    index < value ? theme.sour.colors.purple.main : theme.sour.colors.grey.main
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.sour.colors.red.main,
  letterSpacing: '.2rem',
  textDecoration: 'none'
}));

const RatingFiled = (props: IRatingFieldProps) => {
  const {
    name,
    value,
    onClick,
    errorMessage,
    maxValue = defaultMaxValue
  } = props;

  return (
    <Stack direction='column' spacing={1}>
      <Stack direction='row' spacing={2}>
        {Array.from({ length: maxValue }, (_, index) => (
          <IconButton
            key={index}
            onClick={() => onClick(name, (index + 1).toString())}
          >
            <Star index={index} value={value} />
          </IconButton>
        ))}
      </Stack>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Stack>
  );
};

interface IRatingFieldProps {
  name: string;
  value: number;
  onClick: (propertyName: string, propertyValue: string) => void;
  errorMessage?: string;
  maxValue?: number;
}

export default RatingFiled;
