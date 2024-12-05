// src/componentes/AddFeiraModal.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const AddFeiraModal = ({ onClose }) => {
  const [fairName, setFairName] = useState('');
  const [message, setMessage] = useState('');

  const handleAddFair = async (e) => {
    e.preventDefault();
    setMessage('');

    if(fairName.trim() === ''){
      setMessage('Nome da feira não pode estar vazio.');
      return;
    }

    try {
      const q = query(collection(db, 'fairs'), where('name', '==', fairName.trim()));
      const querySnapshot = await getDocs(q);
      if(!querySnapshot.empty){
        setMessage('Feira já existe.');
        return;
      }

      await addDoc(collection(db, 'fairs'), { name: fairName.trim() });
      setMessage('Feira adicionada com sucesso!');
      setFairName('');
      onClose();
    } catch (err) {
      setMessage('Erro ao adicionar feira.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span onClick={onClose} className="close">&times;</span>
        <h2>Adicionar Nova Feira</h2>
        <form onSubmit={handleAddFair}>
          <input
            type="text"
            placeholder="Nome da Feira"
            value={fairName}
            onChange={(e) => setFairName(e.target.value)}
            required
          />
          <button type="submit">Adicionar</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default AddFeiraModal;
