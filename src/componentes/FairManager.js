// src/componentes/FairManager.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Form, Button, Table, Alert } from 'react-bootstrap';
import './FairManager.css';

const FairManager = () => {
  const [fairs, setFairs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchFairs = async () => {
      try {
        const fairsSnapshot = await getDocs(collection(db, 'fairs'));
        const fairsData = fairsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFairs(fairsData);
      } catch (err) {
        console.error('Erro ao buscar feiras:', err);
        setError('Erro ao buscar feiras.');
      }
    };

    fetchFairs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        const fairRef = doc(db, 'fairs', editingId);
        await updateDoc(fairRef, formData);
        setFairs(fairs.map(fair => (fair.id === editingId ? { id: editingId, ...formData } : fair)));
        setSuccess('Feira atualizada com sucesso!');
        setEditingId(null);
      } else {
        const docRef = await addDoc(collection(db, 'fairs'), formData);
        setFairs([...fairs, { id: docRef.id, ...formData }]);
        setSuccess('Feira adicionada com sucesso!');
      }
      setFormData({ name: '', location: '' });
    } catch (err) {
      console.error('Erro ao salvar feira:', err);
      setError('Erro ao salvar feira.');
    }
  };

  const handleEdit = (fair) => {
    setEditingId(fair.id);
    setFormData({ name: fair.name, location: fair.location });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'fairs', id));
      setFairs(fairs.filter(fair => fair.id !== id));
      setSuccess('Feira deletada com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar feira:', err);
      setError('Erro ao deletar feira.');
    }
  };

  return (
    <div className="fair-manager">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="formFairName" className="mb-3">
          <Form.Label>Nome da Feira:</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite o nome da feira"
            required
          />
        </Form.Group>
        <Form.Group controlId="formFairLocation" className="mb-3">
          <Form.Label>Local:</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Digite o local da feira"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {editingId ? 'Atualizar Feira' : 'Adicionar Feira'}
        </Button>
      </Form>

      <h3>Lista de Feiras</h3>
      {fairs.length === 0 ? (
        <p>Nenhuma feira encontrada.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Local</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fairs.map(fair => (
              <tr key={fair.id}>
                <td>{fair.name}</td>
                <td>{fair.location}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(fair)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(fair.id)}
                  >
                    Deletar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default FairManager;
