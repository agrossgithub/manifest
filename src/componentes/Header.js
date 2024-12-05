// src/componentes/Header.js
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contextos/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">Sistema RDV</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {currentUser && (
            <Nav className="me-auto">
              {currentUser.role === 'Administrador' && (
                <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
              )}
              {currentUser.role === 'Usuário' && (
                <Nav.Link as={Link} to="/user">User</Nav.Link>
              )}
              <Nav.Link as={Link} to="/add-request">Adicionar Solicitação</Nav.Link>
            </Nav>
          )}
          <Nav className="ml-auto">
            {currentUser ? (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
