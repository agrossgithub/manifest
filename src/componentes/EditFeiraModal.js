// src/componentes/EditFeiraModal.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const EditFeiraModal = ({ fair, onClose }) => {
  const [fairName, setFairName] = useState(fair.name);
  const [message, setMessage] = useState('');

  const handleUpdateFair = async (e) => {
    e.preventDefault();
    setMessage('');

    if(fairName.trim() === ''){
      setMessage('Nome da feira não pode estar vazio.');
      return;
    }

    try {
      const fairRef = doc(db, 'fairs', fair.id);
      await updateDoc(fairRef, { name: fairName.trim() });
      setMessage('Feira atualizada com sucesso!');
      onClose();
    } catch (err) {
      setMessage('Erro ao atualizar feira.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span onClick={onClose} className="close">&times;</span>
        <h2>Editar Feira</h2>
        <form onSubmit={handleUpdateFair}>
          <input
            type="text"
            placeholder="Nome da Feira"
            value={fairName}
            onChange={(e) => setFairName(e.target.value)}
            required
          />
          <button type="submit">Atualizar</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default EditFeiraModal;
