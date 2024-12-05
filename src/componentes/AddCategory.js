// src/componentes/AddCategory.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const AddCategory = () => {
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setMessage('');

    if(category.trim() === ''){
      setMessage('Categoria não pode estar vazia.');
      return;
    }

    try {
      const q = query(collection(db, 'categories'), where('name', '==', category.trim()));
      const querySnapshot = await getDocs(q);
      if(!querySnapshot.empty){
        setMessage('Categoria já existe.');
        return;
      }

      await addDoc(collection(db, 'categories'), { name: category.trim() });
      setMessage('Categoria adicionada com sucesso!');
      setCategory('');
    } catch (err) {
      setMessage('Erro ao adicionar categoria.');
    }
  };

  return (
    <div>
      <h2>Adicionar Nova Categoria</h2>
      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          placeholder="Nome da Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddCategory;
