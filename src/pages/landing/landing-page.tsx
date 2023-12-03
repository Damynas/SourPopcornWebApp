import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../components';
import { useAuth } from '../../utils';
import { LoadingPage, SignInDialog, SignUpDialog } from '..';

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
