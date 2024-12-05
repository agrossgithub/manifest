// src/componentes/RequestManager.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button, Table, Form, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../contextos/AuthContext';
import './RequestManager.css';

const RequestManager = ({ statusFilter }) => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditRequest, setCurrentEditRequest] = useState(null);
  const [newNumeroSolicitacao, setNewNumeroSolicitacao] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = collection(db, 'requests');
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(request => request.status === statusFilter);

        // Se o usuário não for Administrador, filtra as solicitações dele
        if (currentUser.role !== 'Administrador') {
          setRequests(data.filter(request => request.userId === currentUser.username));
        } else {
          setRequests(data);
        }
      } catch (err) {
        console.error('Erro ao buscar solicitações:', err);
        setError('Erro ao buscar solicitações.');
      }
    };

    fetchRequests();
  }, [statusFilter, currentUser]);

  const handleEditClick = (request) => {
    setCurrentEditRequest(request);
    setNewNumeroSolicitacao(request.numeroSolicitacao);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!currentEditRequest) return;

    try {
      const requestRef = doc(db, 'requests', currentEditRequest.id);
      await updateDoc(requestRef, {
        numeroSolicitacao: newNumeroSolicitacao,
      });

      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === currentEditRequest.id
            ? { ...req, numeroSolicitacao: newNumeroSolicitacao }
            : req
        )
      );

      setShowEditModal(false);
      setCurrentEditRequest(null);
    } catch (err) {
      console.error('Erro ao atualizar solicitação:', err);
      setError('Erro ao atualizar solicitação.');
    }
  };

  return (
    <div className="request-manager">
      <h3>Solicitações {statusFilter}</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {requests.length === 0 ? (
        <p>Nenhuma solicitação encontrada.</p>
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
              {(currentUser.role === 'Administrador' || currentUser.role === 'Usuário') && (
                <th>Ações</th>
              )}
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
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
                {(currentUser.role === 'Administrador' || currentUser.role === 'Usuário') && (
                  <td>
                    {request.status === 'Pendente' && (
                      <Button variant="warning" size="sm" onClick={() => handleEditClick(request)}>
                        Editar
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Número da Solicitação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNumeroSolicitacao">
              <Form.Label>Número da Solicitação</Form.Label>
              <Form.Control
                type="text"
                value={newNumeroSolicitacao}
                onChange={(e) => setNewNumeroSolicitacao(e.target.value)}
                placeholder="Digite o novo número da solicitação"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RequestManager;
