import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";

import { api } from "../services/apiClient";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

type AuthProvider = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')
  
  Router.push('/');
}

export function AuthProvider({ children }: AuthProvider) {
  const[user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data;

        setUser({ email, permissions, roles });
      })
      .catch(() => {
        signOut();
      });  
    };
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const { data } = await api.post('sessions', {
        email,
        password
      });

      const { token, refreshToken, permissions, roles } = data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');
      console.log(data)
    } catch (err) {
      console.log(err);
    }
    
  }

  return (
    <AuthContext.Provider value={{ user, signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}