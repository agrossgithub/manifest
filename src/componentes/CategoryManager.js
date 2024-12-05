// src/componentes/CategoryManager.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Form, Button, Table, Alert } from 'react-bootstrap';
import './CategoryManager.css';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesData);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        setError('Erro ao buscar categorias.');
      }
    };

    fetchCategories();
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
        const categoryRef = doc(db, 'categories', editingId);
        await updateDoc(categoryRef, formData);
        setCategories(categories.map(category => (category.id === editingId ? { id: editingId, ...formData } : category)));
        setSuccess('Categoria atualizada com sucesso!');
        setEditingId(null);
      } else {
        const docRef = await addDoc(collection(db, 'categories'), formData);
        setCategories([...categories, { id: docRef.id, ...formData }]);
        setSuccess('Categoria adicionada com sucesso!');
      }
      setFormData({ name: '' });
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      setError('Erro ao salvar categoria.');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({ name: category.name });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(category => category.id !== id));
      setSuccess('Categoria deletada com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar categoria:', err);
      setError('Erro ao deletar categoria.');
    }
  };

  return (
    <div className="category-manager">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="formCategoryName" className="mb-3">
          <Form.Label>Nome da Categoria:</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite o nome da categoria"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {editingId ? 'Atualizar Categoria' : 'Adicionar Categoria'}
        </Button>
      </Form>

      <h3>Lista de Categorias</h3>
      {categories.length === 0 ? (
        <p>Nenhuma categoria encontrada.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
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

export default CategoryManager;
