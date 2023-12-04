import { ReactElement } from 'react';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { Image, Page } from '../../components';
import { HttpStatus } from '../../constants';
import AstronautImage from '../../assets/images/astronaut.png';

const getStatusMessage = (statusCode: number) => {
  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return 'Bad Request';
    case HttpStatus.UNAUTHORIZED:
      return 'Unauthorized';
    case HttpStatus.FORBIDDEN:
      return 'Forbidden';
    case HttpStatus.NOT_FOUND:
      return 'Not Found';
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return 'Internal Server Error';
  }
};

const ErrorPage = (props: IErrorPageProps): ReactElement => {
  const { statusCode, message } = props;

  const theme = useTheme();

  return (
    <Page onlyLogo>
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        padding='1rem'
      >
        <Stack
          direction='column'
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Image src={AstronautImage} />
          <Typography variant='h3' color={theme.sour.colors.purple.main}>
            {`${statusCode}  ${message || getStatusMessage(statusCode)}`}
          </Typography>
        </Stack>
      </Box>
    </Page>
  );
};

interface IErrorPageProps {
  statusCode: number;
  message?: string;
}

export default ErrorPage;
