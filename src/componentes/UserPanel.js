// src/componentes/UserPanel.js
import React from 'react';
import RequestForm from './RequestForm';
import ReportGenerator from './ReportGenerator';
import CategoryManager from './CategoryManager';
import RequestManager from './RequestManager';
import { Accordion } from 'react-bootstrap';
import './UserPanel.css';

const UserPanel = () => {
  return (
    <div className="user-panel container mt-4">
      <h2 className="mb-4">Painel do Usuário</h2>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Adicionar Nova Requisição</Accordion.Header>
          <Accordion.Body>
            <RequestForm />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Minhas Solicitações Pendentes</Accordion.Header>
          <Accordion.Body>
            <RequestManager statusFilter="Pendente" />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Minhas Solicitações Aprovadas</Accordion.Header>
          <Accordion.Body>
            <RequestManager statusFilter="Aprovado" />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Gerar Relatórios</Accordion.Header>
          <Accordion.Body>
            <ReportGenerator />
          </Accordion.Body>
        </Accordion.Item>

        {/* Se Usuário não tiver permissão para gerenciar categorias, remova esta seção */}
        {/* <Accordion.Item eventKey="4">
          <Accordion.Header>Gerenciar Categorias</Accordion.Header>
          <Accordion.Body>
            <CategoryManager />
          </Accordion.Body>
        </Accordion.Item> */}
      </Accordion>
    </div>
  );
};

export default UserPanel;
