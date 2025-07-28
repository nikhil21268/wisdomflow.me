import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PrincipleList from './components/PrincipleList';
import PrincipleForm from './components/PrincipleForm';
import AuthPage from './components/AuthPage';
import PrincipleSearch from './components/PrincipleSearch';
import { authFetch } from './api';

export default function AppRoutes() {
  const [items, setItems] = useState([]);
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));

  const fetchItems = async () => {
    const res = await authFetch('/api/principles');
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    }
  };

  const refreshEmbeddings = async () => {
    await authFetch('/api/principles/refresh', { method: 'POST' });
    fetchItems();
  };

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setAuthed(false);
  }

  useEffect(() => {
    if (authed) fetchItems();
  }, [authed]);

  if (!authed) {
    return (
      <Routes>
        <Route path="*" element={<AuthPage onAuth={() => setAuthed(true)} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={(
          <div>
            <nav>
              <Link to="/search">Search</Link> |{' '}
              <button onClick={refreshEmbeddings}>Refresh</button> |{' '}
              <button onClick={logout}>Logout</button>
            </nav>
            <PrincipleForm onAdded={fetchItems} />
            <PrincipleList items={items} />
          </div>
        )}
      />
      <Route
        path="/search"
        element={(
          <div>
            <nav>
              <Link to="/">Home</Link> |{' '}
              <button onClick={logout}>Logout</button>
            </nav>
            <PrincipleSearch />
          </div>
        )}
      />
    </Routes>
  );
}
