import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import ArtistSearch from './ArtistSearch';
import ArtistPage from './ArtistPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/artist-search" element={<ArtistSearch />} />
        <Route path="/artist/:id" element={<ArtistPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
