import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateBidPage from './pages/CreateBidPage';
import BidDetailPage from './pages/BidDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-bid" element={<CreateBidPage />} />
        <Route path="/bid/:id" element={<BidDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;