import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from '../../utils';
import { Image, Page } from '../../components';
import { LoadingPage, SignInDialog, SignUpDialog } from '..';
import PopcornImage from '../../assets/images/popcorn.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const { authenticate, loading, authenticated } = useAuth();

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  useEffect(() => {
    if (!loading && authenticated) {
      navigate('/home');
    }
  }, [authenticated, loading, navigate]);

  const [signInFormDialogOpen, setSignInFormDialogOpen] =
    useState<boolean>(false);

  const changeSignInFormDialogState = () => {
    setSignInFormDialogOpen(!signInFormDialogOpen);
  };

  const [signUpFormDialogOpen, setSignUpFormDialogOpen] =
    useState<boolean>(false);

  const changeSignUpFormDialogState = () => {
    setSignUpFormDialogOpen(!signUpFormDialogOpen);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Page
      onSignInButtonClick={changeSignInFormDialogState}
      onSignUpButtonClick={changeSignUpFormDialogState}
    >
      <>
        <Box
          height='100%'
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Image src={PopcornImage} />
        </Box>
        {signInFormDialogOpen && (
          <SignInDialog onClose={changeSignInFormDialogState} />
        )}
        {signUpFormDialogOpen && (
          <SignUpDialog onClose={changeSignUpFormDialogState} />
        )}
      </>
    </Page>
  );
};

export default LandingPage;
