import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  googleLogin,
  loginUser,
  registerUser,
} from '../services/authService.js';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('skillpathToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('skillpathToken');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  async function register(formData) {
    const data = await registerUser(formData);
    localStorage.setItem('skillpathToken', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function login(formData) {
    const data = await loginUser(formData);
    localStorage.setItem('skillpathToken', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function handleGoogleLogin(credential) {
    const data = await googleLogin(credential);
    localStorage.setItem('skillpathToken', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('skillpathToken');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      googleLogin: handleGoogleLogin,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
export { AuthProvider };
