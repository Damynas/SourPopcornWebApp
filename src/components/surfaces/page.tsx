import { ReactElement } from 'react';
import { Box, Stack, styled } from '@mui/material';
import { ApplicationBar } from '.';
import { LoadingPage } from '../../pages/loading';

const ContentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.sour.colors.grey.main,
  height: 'calc(100vh - 3rem)',
  display: 'flex',
  justifyContent: 'center'
}));

const Page = (props: IPageProps) => {
  const {
    authenticated = false,
    loading = false,
    onlyLogo = false,
    selectedPage,
    children,
    onSignInButtonClick,
    onSignUpButtonClick,
    signInButtonLoading,
    signUnButtonLoading
  } = props;

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Stack direction='column'>
      <ApplicationBar
        authenticated={authenticated}
        onlyLogo={onlyLogo}
        selectedPage={selectedPage}
        onSignInButtonClick={onSignInButtonClick}
        onSignUpButtonClick={onSignUpButtonClick}
        signInButtonLoading={signInButtonLoading}
        signUnButtonLoading={signUnButtonLoading}
      ></ApplicationBar>
      <ContentContainer>{children}</ContentContainer>
    </Stack>
  );
};

interface IPageProps {
  authenticated?: boolean;
  loading?: boolean;
  onlyLogo?: boolean;
  selectedPage?: string;
  onSignInButtonClick?: () => void;
  onSignUpButtonClick?: () => void;
  signInButtonLoading?: boolean;
  signUnButtonLoading?: boolean;
  children?: ReactElement;
}

export default Page;
