import './App.scss';

import { Header } from 'components/Header';
import PassAnalysis from 'pages/PassAnalysis';
import PassNetworks from 'pages/PassNetworks';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<PassNetworks />} />
            <Route path="pass-networks" element={<PassNetworks />} />
            <Route path="pass-analysis" element={<PassAnalysis />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
