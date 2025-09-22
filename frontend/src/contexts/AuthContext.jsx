import React, { createContext, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Create a memoized selector
  const selectAuthState = createSelector(
    [(state) => state.auth],
    (auth) => ({
      isAuthenticated: auth.isAuthenticated,
      user: auth.user
    })
  );

  const { isAuthenticated, user } = useSelector(selectAuthState);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isAuthenticated: !!isAuthenticated,
    user
  }), [isAuthenticated, user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
