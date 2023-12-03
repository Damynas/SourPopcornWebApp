import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routes from './routes';
import { ProtectedRoute } from '.';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => {
          if (route.enabled) {
            return (
              <Route
                key={route.key}
                path={route.path}
                element={
                  route.protected && route.role ? (
                    <ProtectedRoute role={route.role}>
                      {route.component}
                    </ProtectedRoute>
                  ) : (
                    route.component
                  )
                }
              />
            );
          }
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
