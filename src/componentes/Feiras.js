// src/componentes/Feiras.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Feiras = () => {
  const [fairs, setFairs] = useState([]);

  useEffect(() => {
    const fetchFairs = async () => {
      const querySnapshot = await getDocs(collection(db, 'fairs'));
      const frs = [];
      querySnapshot.forEach((doc) => {
        frs.push(doc.data().name);
      });
      setFairs(frs);
    };

    fetchFairs();
  }, []);

  return (
    <div>
      <h2>Lista de Feiras</h2>
      <ul>
        {fairs.map((fair, index) => (
          <li key={index}>{fair}</li>
        ))}
      </ul>
    </div>
  );
};

export default Feiras;
