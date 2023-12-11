import { SyntheticEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Stack, Typography, styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TheatersIcon from '@mui/icons-material/Theaters';
import { Button, IconButton } from '..';
import { Popover } from '../utils';
import { HttpStatus, PageName, UserRole } from '../../constants';
import { DataContext, hasRole, useSave, type IDataContext } from '../../utils';

const ApplicationBarBase = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.sour.colors.grey.dark,
  height: '3rem',
  flexDirection: 'row',
  justifyContent: 'space-between'
}));

interface IContainerProps {
  width?: string;
  hideOnSmall?: boolean;
  showOnSmall?: boolean;
}

const Container = styled(Stack, {
  shouldForwardProp: (prop) =>
    prop !== 'width' && prop !== 'hideOnSmall' && prop !== 'showOnSmall'
})<IContainerProps>(({ theme, width, hideOnSmall, showOnSmall }) => ({
  margin: '0.5rem',
  alignItems: 'center',
  ...(width && {
    ['width']: width
  }),
  ...(hideOnSmall && {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.up('sm')]: {
      display: 'flex'
    }
  }),
  ...(showOnSmall && {
    [theme.breakpoints.down('sm')]: {
      display: 'flex'
    },
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  })
}));

const LogoText = styled(Typography)(({ theme }) => ({
  color: theme.sour.colors.purple.main,
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  textDecoration: 'none',
  textAlign: 'center',
  cursor: 'pointer'
}));

const LogoIcon = styled(TheatersIcon)(({ theme }) => ({
  color: theme.sour.colors.purple.main,
  cursor: 'pointer'
}));

const pages = [
  { name: PageName.USERS, requiredRole: UserRole.ADMIN },
  { name: PageName.MOVIES, requiredRole: UserRole.USER },
  { name: PageName.DIRECTORS, requiredRole: UserRole.USER }
];

const ApplicationBar = (props: IApplicationBarProps) => {
  const {
    authenticated,
    onlyLogo,
    selectedPage,
    onSignInButtonClick,
    onSignUpButtonClick,
    signInButtonLoading,
    signUnButtonLoading
  } = props;

  const { apiData, user, setUser, openSnackbar } = useContext(
    DataContext
  ) as IDataContext;
  const navigate = useNavigate();

  const signOut = useSave(`${apiData.apiUrl}/auth/logout`);

  const [menuAnchor, setMenuAnchor] = useState<Element | null>(null);
  const handleMenuButtonClick = (target: Element | null) => {
    setMenuAnchor(target);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogoClick = () => {
    navigate(authenticated ? '/home' : '/');
  };

  const getPages = () => {
    return pages.map((page) => {
      if (hasRole(user, page.requiredRole)) {
        return page.name;
      }
    });
  };

  const handleSignOutButtonClick = () => {
    signOut.save({}, apiData.requestConfig);
  };

  if (signOut.response) {
    if (signOut.response.status === HttpStatus.NO_CONTENT) {
      setUser(null);
      openSnackbar('Signed Out Successfully');
      navigate('/');
    }
    signOut.clearResponse();
  }

  if (signOut.error) {
    openSnackbar('Sign Out Unsuccessful', 'error');
    signOut.clearError();
  }

  return (
    <ApplicationBarBase position='sticky' elevation={3}>
      {authenticated && !onlyLogo && (
        <Container
          direction='row'
          justifyContent='flex-start'
          spacing={0.5}
          showOnSmall
        >
          <IconButton
            onClick={(event: SyntheticEvent<Element>) =>
              handleMenuButtonClick(event.currentTarget)
            }
          >
            <MenuIcon />
          </IconButton>
          <Popover
            open={Boolean(menuAnchor)}
            anchor={menuAnchor}
            onClose={handleMenuClose}
          >
            <Container
              justifyContent='center'
              alignItems='center'
              spacing={0.5}
            >
              {getPages().map(
                (page) =>
                  page && (
                    <Button
                      key={page}
                      variant='text'
                      selected={page === selectedPage}
                      onClick={() => navigate(`/${page.toLowerCase()}`)}
                    >
                      {page}
                    </Button>
                  )
              )}
            </Container>
          </Popover>
        </Container>
      )}
      <Container direction='row' justifyContent='center' spacing={0.5}>
        <Container
          direction='row'
          justifyContent='center'
          spacing={0.5}
          onClick={handleLogoClick}
        >
          <LogoIcon />
          <LogoText>SOURPOPCORN</LogoText>
        </Container>
        {authenticated && !onlyLogo && (
          <Container
            direction='row'
            justifyContent='center'
            spacing={0.5}
            hideOnSmall
          >
            {getPages().map(
              (page) =>
                page && (
                  <Button
                    key={page}
                    variant='text'
                    selected={page === selectedPage}
                    onClick={() => navigate(`/${page.toLowerCase()}`)}
                  >
                    {page}
                  </Button>
                )
            )}
          </Container>
        )}
      </Container>
      <Container direction='row' justifyContent='flex-end' spacing={0.5}>
        {!onlyLogo &&
          (authenticated ? (
            <Button
              variant='outlined'
              onClick={handleSignOutButtonClick}
              loading={signOut.loading}
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button
                variant='outlined'
                onClick={onSignInButtonClick}
                loading={signInButtonLoading}
              >
                Sign In
              </Button>
              <Button
                variant='contained'
                onClick={onSignUpButtonClick}
                loading={signUnButtonLoading}
              >
                Sign Up
              </Button>
            </>
          ))}
      </Container>
    </ApplicationBarBase>
  );
};

interface IApplicationBarProps {
  authenticated?: boolean;
  onlyLogo?: boolean;
  selectedPage?: string;
  onSignInButtonClick?: () => void;
  onSignUpButtonClick?: () => void;
  signInButtonLoading?: boolean;
  signUnButtonLoading?: boolean;
}

export default ApplicationBar;
