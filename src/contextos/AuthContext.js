// src/contextos/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const users = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'Administrador',
  },
  {
    username: 'junior',
    password: 'junior123',
    role: 'Usuário',
  },
  {
    username: 'diego',
    password: 'diego123',
    role: 'Usuário',
  },
];

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
      console.log('Usuário carregado do localStorage:', storedUser);
    }
  }, []);

  // Função de login personalizada
  const login = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    } else {
      return { success: false, message: 'Credenciais inválidas.' };
    }
  };

  // Função de logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
