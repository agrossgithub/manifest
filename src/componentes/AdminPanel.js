// src/componentes/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button, Table, Alert, Dropdown, DropdownButton } from 'react-bootstrap';
import { useAuth } from '../contextos/AuthContext';
import ReportGenerator from './ReportGenerator'; // Importando o ReportGenerator
import './AdminPanel.css';

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pendente', 'aprovado'

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = collection(db, 'requests');
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(data);
      } catch (err) {
        console.error('Erro ao buscar solicitações:', err);
        setError('Erro ao buscar solicitações.');
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status.toLowerCase() === filter));
    }
  }, [filter, requests]);

  const handleApprove = async (requestId) => {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, { status: 'Aprovado' });
      setRequests(requests.map(req => req.id === requestId ? { ...req, status: 'Aprovado' } : req));
      setSuccess('Solicitação aprovada com sucesso!');
    } catch (err) {
      console.error('Erro ao aprovar solicitação:', err);
      setError('Erro ao aprovar solicitação.');
    }
  };

  const handleEdit = (requestId) => {
    // Implemente a lógica de edição conforme necessário
    alert(`Editar solicitação ID: ${requestId}`);
  };

  const handleFilterSelect = (selectedFilter) => {
    setFilter(selectedFilter);
    setSuccess('');
    setError('');
  };

  return (
    <div className="admin-panel">
      <h2>Painel do Administrador</h2>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <DropdownButton
          id="dropdown-basic-button"
          title={
            filter === 'all'
              ? 'Todas as Solicitações'
              : filter === 'pendente'
                ? 'Solicitações Pendentes'
                : 'Solicitações Aprovadas'
          }
          onSelect={handleFilterSelect}
        >
          <Dropdown.Item eventKey="all">Todas as Solicitações</Dropdown.Item>
          <Dropdown.Item eventKey="pendente">Solicitações Pendentes</Dropdown.Item>
          <Dropdown.Item eventKey="aprovado">Solicitações Aprovadas</Dropdown.Item>
        </DropdownButton>

        {/* Utilizar o ReportGenerator para CSV */}
        <ReportGenerator data={filteredRequests} filter={filter} />
      </div>

      {filteredRequests.length === 0 ? (
        <p>Nenhuma solicitação encontrada para o status selecionado.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoria</th>
              <th>Feira</th>
              <th>Local</th>
              <th>Valor Gasto (R$)</th>
              <th>Método de Pagamento</th>
              <th>Descrição</th>
              <th>Número da Solicitação</th>
              <th>Anexo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request.id}>
                <td>{request.title}</td>
                <td>{request.categoria}</td>
                <td>{request.feira}</td>
                <td>{request.local}</td>
                <td>R$ {request.valorGasto}</td>
                <td>{request.metodoPagamento}</td>
                <td>{request.descricao}</td>
                <td>{request.numeroSolicitacao}</td>
                <td>
                  {request.anexo ? (
                    <a href={request.anexo} target="_blank" rel="noopener noreferrer">
                      Ver Anexo
                    </a>
                  ) : (
                    'Nenhum'
                  )}
                </td>
                <td>{request.status}</td>
                <td>
                  {request.status.toLowerCase() === 'pendente' && (
                    <>
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => handleApprove(request.id)}
                        className="me-2"
                      >
                        Aprovar
                      </Button>
                      <Button 
                        variant="warning" 
                        size="sm" 
                        onClick={() => handleEdit(request.id)}
                      >
                        Editar
                      </Button>
                    </>
                  )}
                  {request.status.toLowerCase() === 'aprovado' && (
                    <Button 
                      variant="warning" 
                      size="sm" 
                      onClick={() => handleEdit(request.id)}
                    >
                      Editar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminPanel;
