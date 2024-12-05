// src/componentes/EditCategoriaModal.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const EditCategoriaModal = ({ category, onClose }) => {
  const [categoryName, setCategoryName] = useState(category.name);
  const [message, setMessage] = useState('');

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setMessage('');

    if(categoryName.trim() === ''){
      setMessage('Nome da categoria não pode estar vazio.');
      return;
    }

    try {
      const categoryRef = doc(db, 'categories', category.id);
      await updateDoc(categoryRef, { name: categoryName.trim() });
      setMessage('Categoria atualizada com sucesso!');
      onClose();
    } catch (err) {
      setMessage('Erro ao atualizar categoria.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span onClick={onClose} className="close">&times;</span>
        <h2>Editar Categoria</h2>
        <form onSubmit={handleUpdateCategory}>
          <input
            type="text"
            placeholder="Nome da Categoria"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <button type="submit">Atualizar</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default EditCategoriaModal;
