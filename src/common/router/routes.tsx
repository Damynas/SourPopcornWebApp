import { ReactElement } from 'react';
import {
  DirectorListPage,
  ErrorPage,
  HomePage,
  LandingPage,
  MovieListPage,
  MoviePage,
  UserListPage
} from '../../pages';
import { IPageProps } from '..';
import { HttpStatus, UserRole } from '../../constants';

interface IRoute {
  key: string;
  path: string;
  enabled: boolean;
  protected: boolean;
  role?: (typeof UserRole)[keyof typeof UserRole];
  component: ReactElement<IPageProps>;
}

const routes: IRoute[] = [
  {
    key: 'landing-page-route',
    path: '/',
    enabled: true,
    protected: false,
    component: <LandingPage />
  },
  {
    key: 'home-page-route',
    path: '/home',
    enabled: true,
    protected: true,
    role: UserRole.USER,
    component: <HomePage />
  },
  {
    key: 'user-list-page-route',
    path: '/users',
    enabled: true,
    protected: true,
    role: UserRole.ADMIN,
    component: <UserListPage />
  },
  {
    key: 'movie-list-page-route',
    path: '/movies',
    enabled: true,
    protected: true,
    role: UserRole.USER,
    component: <MovieListPage />
  },
  {
    key: 'movie-page-route',
    path: '/movies/:id?',
    enabled: true,
    protected: true,
    role: UserRole.USER,
    component: <MoviePage />
  },
  {
    key: 'director-list-page-route',
    path: '/directors',
    enabled: true,
    protected: true,
    role: UserRole.USER,
    component: <DirectorListPage />
  },
  {
    key: 'unauthorized-page-route',
    path: '/unauthorized',
    enabled: true,
    protected: false,
    component: <ErrorPage statusCode={HttpStatus.UNAUTHORIZED} />
  },
  {
    key: 'forbidden-page-route',
    path: '/forbidden',
    enabled: true,
    protected: false,
    component: <ErrorPage statusCode={HttpStatus.FORBIDDEN} />
  },
  {
    key: 'not-found-page-route',
    path: '*',
    enabled: true,
    protected: false,
    component: <ErrorPage statusCode={HttpStatus.NOT_FOUND} />
  },
  {
    key: 'error-page-route',
    path: '/error',
    enabled: true,
    protected: false,
    component: (
      <ErrorPage
        statusCode={HttpStatus.INTERNAL_SERVER_ERROR}
        message='Error'
      />
    )
  },
  {
    key: 'page-not-found-page-route',
    path: '*',
    enabled: true,
    protected: false,
    component: (
      <ErrorPage statusCode={HttpStatus.NOT_FOUND} message='Page Not Found' />
    )
  }
];

export default routes;
