


import { useContext, useEffect } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import { Navigate } from 'react-router-dom';
import { useApplicationSettings } from '../settings/ApplicationSettings';

const RedirectIfAuthenticated = ({ children }) => {
  const { currentUser, fetchCurrentUser } = useApplicationSettings();

  const isAuthenticated = currentUser && currentUser.id;

  useEffect(() => {
    fetchCurrentUser(); // ensure we refresh auth info
  }, [fetchCurrentUser]);

  if (isAuthenticated) {
    return <Navigate to="/admin/analytics" replace={true} />;
  }

  return children;
};

export default RedirectIfAuthenticated;
