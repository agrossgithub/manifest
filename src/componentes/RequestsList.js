// src/componentes/RequestsList.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import EditRequest from './EditRequest';
import ApproveButton from './ApproveButton';
import RejectButton from './RejectButton';
import { useAuth } from '../contextos/AuthContext';

const RequestsList = ({ isAdmin }) => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [editRequest, setEditRequest] = useState(null);

  useEffect(() => {
    let q;
    if(isAdmin){
      q = collection(db, 'requests');
    } else {
      q = query(collection(db, 'requests'), where('userId', '==', currentUser.uid));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reqs = [];
      querySnapshot.forEach((doc) => {
        reqs.push({ id: doc.id, ...doc.data() });
      });
      setRequests(reqs);
    });

    return () => unsubscribe();
  }, [isAdmin, currentUser]);

  const handleEdit = (request) => {
    setEditRequest(request);
  };

  const closeEdit = () => {
    setEditRequest(null);
  };

  return (
    <div>
      <h2>{isAdmin ? 'Todas as Solicitações' : 'Minhas Solicitações'}</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Categoria</th>
            <th>Descrição</th>
            <th>Status</th>
            <th>Anexo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className={req.status === 'pending' ? 'blink' : ''}>
              <td>{req.id}</td>
              <td>{req.category}</td>
              <td>{req.description}</td>
              <td>{req.status}</td>
              <td>
                {req.attachmentUrl ? (
                  <img src={req.attachmentUrl} alt="Anexo" width="100" />
                ) : 'Nenhum'}
              </td>
              <td>
                <button onClick={() => handleEdit(req)}>Editar</button>
                {isAdmin && (
                  <>
                    {req.status === 'pending' && (
                      <>
                        <ApproveButton requestId={req.id} />
                        <RejectButton requestId={req.id} />
                      </>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editRequest && <EditRequest request={editRequest} onClose={closeEdit} />}
    </div>
  );
};

export default RequestsList;
