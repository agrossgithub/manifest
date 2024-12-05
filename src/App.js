// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './componentes/Header';
import Login from './componentes/Login';
import AdminPanel from './componentes/AdminPanel';
import UserPanel from './componentes/UserPanel';
import RequestForm from './componentes/RequestForm';
import { useAuth } from './contextos/AuthContext';
import './App.css';

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Header />
      <div className="main-content" style={{ marginTop: '80px', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Navigate to={currentUser ? "/add-request" : "/login"} />} />
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/add-request" />} />
          <Route path="/admin" element={currentUser && currentUser.role === 'Administrador' ? <AdminPanel /> : <Navigate to="/login" />} />
          <Route path="/user" element={currentUser && currentUser.role === 'Usuário' ? <UserPanel /> : <Navigate to="/login" />} />
          <Route path="/add-request" element={currentUser ? <RequestForm /> : <Navigate to="/login" />} />
          {/* Adicione outras rotas conforme necessário */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
