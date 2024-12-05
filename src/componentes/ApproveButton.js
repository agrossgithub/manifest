// src/componentes/ApproveButton.js
import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ApproveButton = ({ requestId }) => {
  const handleApprove = async () => {
    const requestRef = doc(db, 'requests', requestId);
    await updateDoc(requestRef, { status: 'approved' });
  };

  return <button onClick={handleApprove}>Aprovar</button>;
};

export default ApproveButton;
