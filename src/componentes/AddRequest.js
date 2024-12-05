// src/componentes/AddRequest.js
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contextos/AuthContext';

const AddRequest = () => {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [fairs, setFairs] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    fair: '',
    location: '',
    expenseValue: '',
    currencyType: 'CASH',
    paymentMethod: 'DINHEIRO',
    description: '',
    requestNumber: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const cats = [];
      querySnapshot.forEach((doc) => {
        cats.push(doc.data().name);
      });
      setCategories(cats);
    };

    const fetchFairs = async () => {
      const querySnapshot = await getDocs(collection(db, 'fairs'));
      const frs = [];
      querySnapshot.forEach((doc) => {
        frs.push(doc.data().name);
      });
      setFairs(frs);
    };

    fetchCategories();
    fetchFairs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if(e.target.files[0]){
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      let attachmentUrl = '';
      if(attachment){
        const storageRef = ref(storage, `attachments/${Date.now()}_${attachment.name}`);
        const uploadTask = await uploadBytes(storageRef, attachment);
        attachmentUrl = await getDownloadURL(uploadTask.ref);
      }

      await addDoc(collection(db, 'requests'), {
        userId: currentUser.uid,
        category: formData.category,
        fair: formData.fair,
        location: formData.location,
        expenseValue: parseFloat(formData.expenseValue.replace(',', '.')),
        currencyType: formData.currencyType,
        paymentMethod: formData.paymentMethod,
        description: formData.description,
        requestNumber: formData.requestNumber,
        attachmentUrl: attachmentUrl, // Salva a URL da imagem
        status: 'pending',
        timestamp: serverTimestamp()
      });

      setMessage('Solicitação adicionada com sucesso!');
      setFormData({
        category: '',
        fair: '',
        location: '',
        expenseValue: '',
        currencyType: 'CASH',
        paymentMethod: 'DINHEIRO',
        description: '',
        requestNumber: ''
      });
      setAttachment(null);
    } catch (err) {
      setMessage('Erro ao adicionar solicitação.');
    }
  };

  return (
    <div>
      <h2>Adicionar Nova Solicitação</h2>
      <form onSubmit={handleSubmit}>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Selecione uma categoria</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select><br/>

        <select name="fair" value={formData.fair} onChange={handleChange} required>
          <option value="">Selecione uma feira</option>
          {fairs.map((fair, index) => (
            <option key={index} value={fair}>{fair}</option>
          ))}
        </select><br/>

        <input
          type="text"
          name="location"
          placeholder="Local"
          value={formData.location}
          onChange={handleChange}
          required
        /><br/>

        <input
          type="text"
          name="expenseValue"
          placeholder="Valor do Gasto (R$)"
          value={formData.expenseValue}
          onChange={(e) => setFormData({...formData, expenseValue: e.target.value})}
          required
        /><br/>

        <label>Tipo de Moeda:</label>
        <select name="currencyType" value={formData.currencyType} onChange={handleChange} required>
          <option value="CASH">Dinheiro</option>
          <option value="CARD">Cartão</option>
        </select><br/>

        <label>Método de Pagamento:</label>
        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
          <option value="DINHEIRO">Dinheiro</option>
          <option value="CARTAO">Cartão</option>
        </select><br/>

        <textarea
          name="description"
          placeholder="Descrição"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea><br/>

        <input
          type="text"
          name="requestNumber"
          placeholder="Número da Solicitação"
          value={formData.requestNumber}
          onChange={handleChange}
          required
        /><br/>

        <input type="file" onChange={handleFileChange} accept="image/*" capture="environment" /><br/>

        <button type="submit">Enviar Solicitação</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddRequest;
