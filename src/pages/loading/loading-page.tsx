import { Box, CircularProgress, styled } from '@mui/material';
import { Page } from '../../components';

const Loader = styled(CircularProgress)(({ theme }) => ({
  color: theme.sour.colors.purple.main
}));

const LoadingPage = () => {
  return (
    <Page onlyLogo>
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100%'
      >
        <Loader size='5rem' thickness={5} />
      </Box>
    </Page>
  );
};

export default LoadingPage;
