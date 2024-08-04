import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import ArtistSearch from './ArtistSearch';
import ArtistPage from './ArtistPage';

//check if token exists
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/artist-search"
          element={
            <PrivateRoute>
              <ArtistSearch />
            </PrivateRoute>
          }
        />
        <Route
          path="/artist/:id"
          element={
            <PrivateRoute>
              <ArtistPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
