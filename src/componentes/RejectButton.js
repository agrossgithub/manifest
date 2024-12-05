// src/componentes/RejectButton.js
import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const RejectButton = ({ requestId }) => {
  const handleReject = async () => {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, { status: 'rejected' });
      alert('Solicitação rejeitada com sucesso.');
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
      alert('Ocorreu um erro ao rejeitar a solicitação.');
    }
  };

  return <button onClick={handleReject}>Rejeitar</button>;
};

export default RejectButton;
