import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import { UserProvider, UserContext } from './UserContext';
import './Background.css';

const AppRoutes = () => {
  const { userId } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={userId ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={userId ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
