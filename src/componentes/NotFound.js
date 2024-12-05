// src/componentes/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>404 - Página Não Encontrada</h2>
      <p>A página que você está procurando não existe.</p>
      <Link to="/">Voltar para a Página Inicial</Link>
    </div>
  );
};

export default NotFound;
