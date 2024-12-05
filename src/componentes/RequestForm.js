// src/componentes/RequestForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contextos/AuthContext';
import './RequestForm.css';

const RequestForm = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    categoria: '',
    feira: '',
    local: '',
    valorGasto: '',
    metodoPagamento: '',
    descricao: '',
    numeroSolicitacao: '',
    anexo: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // URL do seu Web App do Google Apps Script
  const uploadEndpoint = 'https://script.google.com/macros/s/AKfycbzIZVoxtKZgr-7i6_Jmj0Eg6Y-nKPVHRl5-F2IWxMjlckvu6_rtzF1WVNqmDjoH1SBm/exec'; // Substitua pelo seu URL

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = collection(db, 'categories');
        const querySnapshot = await getDocs(q);
        const categoryList = querySnapshot.docs.map(doc => doc.data().name);
        setCategories(categoryList);
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor, selecione um arquivo para enviar.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        const mimeType = selectedFile.type;
        const fileName = selectedFile.name;

        const response = await fetch(uploadEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            file: base64Data,
            mimeType: mimeType,
            fileName: fileName,
          }),
        });

        const result = await response.json();

        if (result.status === 'success') {
          setFormData({ ...formData, anexo: result.url });
          setSuccess('Anexo enviado com sucesso!');
        } else {
          setError(result.message || 'Erro ao enviar anexo.');
        }
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Erro ao ler o arquivo.');
        setUploading(false);
      };
    } catch (err) {
      console.error('Erro ao enviar anexo:', err);
      setError('Erro ao enviar anexo.');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.anexo) {
      setError('Por favor, envie um anexo antes de submeter a solicitação.');
      return;
    }

    try {
      await addDoc(collection(db, 'requests'), {
        ...formData,
        status: 'Pendente',
        userId: currentUser.username,
        createdAt: new Date(),
      });
      setSuccess('Solicitação adicionada com sucesso!');
      setFormData({
        title: '',
        categoria: '',
        feira: '',
        local: '',
        valorGasto: '',
        metodoPagamento: '',
        descricao: '',
        numeroSolicitacao: '',
        anexo: '',
      });
    } catch (err) {
      console.error('Erro ao adicionar solicitação:', err);
      setError('Erro ao adicionar solicitação.');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError('Nome da categoria não pode ser vazio.');
      return;
    }

    try {
      const categoryRef = doc(collection(db, 'categories'));
      await setDoc(categoryRef, { name: newCategory.trim() });

      setCategories([...categories, newCategory.trim()]);
      setFormData({ ...formData, categoria: newCategory.trim() });
      setNewCategory('');
      setShowAddCategoryModal(false);
      setSuccess('Categoria adicionada com sucesso!');
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
      setError('Erro ao adicionar categoria.');
    }
  };

  return (
    <div className="request-form">
      <h3>Adicionar Nova Solicitação</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Título */}
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Digite o título da solicitação"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Categoria */}
        <Form.Group controlId="formCategoria" className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </Form.Select>
          <Button variant="link" onClick={() => setShowAddCategoryModal(true)}>
            Adicionar nova categoria
          </Button>
        </Form.Group>

        {/* Feira */}
        <Form.Group controlId="formFeira" className="mb-3">
          <Form.Label>Feira</Form.Label>
          <Form.Control
            type="text"
            name="feira"
            placeholder="Digite o nome da feira"
            value={formData.feira}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Local */}
        <Form.Group controlId="formLocal" className="mb-3">
          <Form.Label>Local</Form.Label>
          <Form.Control
            type="text"
            name="local"
            placeholder="Digite a localização"
            value={formData.local}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Valor Gasto */}
        <Form.Group controlId="formValorGasto" className="mb-3">
          <Form.Label>Valor Gasto (R$)</Form.Label>
          <Form.Control
            type="number"
            name="valorGasto"
            placeholder="Digite o valor gasto"
            value={formData.valorGasto}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </Form.Group>

        {/* Método de Pagamento */}
        <Form.Group controlId="formMetodoPagamento" className="mb-3">
          <Form.Label>Método de Pagamento</Form.Label>
          <Form.Select
            name="metodoPagamento"
            value={formData.metodoPagamento}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o método de pagamento</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão">Cartão</option>
          </Form.Select>
        </Form.Group>

        {/* Descrição */}
        <Form.Group controlId="formDescricao" className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            name="descricao"
            rows={3}
            placeholder="Descreva a solicitação"
            value={formData.descricao}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Número da Solicitação */}
        <Form.Group controlId="formNumeroSolicitacao" className="mb-3">
          <Form.Label>Número da Solicitação</Form.Label>
          <Form.Control
            type="text"
            name="numeroSolicitacao"
            placeholder="Digite o número da solicitação"
            value={formData.numeroSolicitacao}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Anexo */}
        <Form.Group controlId="formAnexo" className="mb-3">
          <Form.Label>Anexo:</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type="file"
              name="anexo"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
            />
            <Button 
              variant="secondary" 
              onClick={handleUpload} 
              disabled={uploading || !selectedFile}
              className="ms-2"
            >
              {uploading ? 'Enviando...' : 'Enviar Anexo'}
            </Button>
          </div>
          {formData.anexo && (
            <Form.Text className="text-success">
              Anexo enviado com sucesso.
            </Form.Text>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={!formData.anexo}>
          Enviar Solicitação
        </Button>
      </Form>

      {/* Modal para Adicionar Nova Categoria */}
      <Modal show={showAddCategoryModal} onHide={() => setShowAddCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Nova Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formNewCategory" className="mb-3">
            <Form.Label>Nome da Categoria</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome da nova categoria"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddCategoryModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Adicionar Categoria
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RequestForm;
