import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrincipleList from './components/PrincipleList';
import PrincipleForm from './components/PrincipleForm';
import { authFetch } from './api';

export default function AppRoutes() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const res = await authFetch('/api/principles');
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={(
          <div>
            <PrincipleForm onAdded={fetchItems} />
            <PrincipleList items={items} />
          </div>
        )}
      />
    </Routes>
  );
}
