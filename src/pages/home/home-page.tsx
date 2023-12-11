import { Box } from '@mui/material';
import { Image, Page } from '../../components';
import PopcornImage from '../../assets/images/popcorn.png';

const HomePage = () => {
  return (
    <Page authenticated>
      <Box
        height='100%'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <Image src={PopcornImage} />
      </Box>
    </Page>
  );
};

export default HomePage;
