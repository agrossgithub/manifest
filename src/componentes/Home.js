// src/componentes/Home.js
import React, { useEffect } from 'react';
import { useAuth } from '../contextos/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Administrador') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    }
  }, [currentUser, navigate]);

  return null; // Não renderiza nada
};

export default Home;
