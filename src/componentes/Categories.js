// src/componentes/Categories.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const cats = [];
      querySnapshot.forEach((doc) => {
        cats.push(doc.data().name);
      });
      setCategories(cats);
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Lista de Categorias</h2>
      <ul>
        {categories.map((cat, index) => (
          <li key={index}>{cat}</li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
