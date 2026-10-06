/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as portalApi from '../services/portalApi';

const PortalAuthContext = createContext(null);

export function PortalAuthProvider({ children }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    portalApi.setToken(null);
    setClient(null);
  }, []);

  useEffect(() => {
    portalApi.setUnauthorizedHandler(() => setClient(null));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const token = portalApi.getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await portalApi.fetchMe();
        if (!cancelled) setClient(data.client);
      } catch {
        if (!cancelled) portalApi.setToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    bootstrap();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await portalApi.login(email, password);
    portalApi.setToken(data.token);
    setClient(data.client);
    return data.client;
  }, []);

  const completePasswordSetup = useCallback(async (payload) => {
    const data = await portalApi.resetPassword(payload);
    if (data.token) {
      portalApi.setToken(data.token);
      setClient(data.client);
    }
    return data.client;
  }, []);

  const logout = useCallback(async () => {
    try {
      await portalApi.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const refresh = useCallback(async () => {
    const data = await portalApi.fetchMe();
    setClient(data.client);
    return data.client;
  }, []);

  const value = {
    client,
    isAuthenticated: Boolean(client),
    loading,
    login,
    logout,
    refresh,
    completePasswordSetup,
  };

  return <PortalAuthContext.Provider value={value}>{children}</PortalAuthContext.Provider>;
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error('usePortalAuth must be used within a PortalAuthProvider');
  return ctx;
}
