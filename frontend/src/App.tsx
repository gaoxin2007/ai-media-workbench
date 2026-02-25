import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import IPPositioning from './pages/IPPositioning';
import Benchmark from './pages/Benchmark';
import ScriptFactory from './pages/ScriptFactory';
import AvatarGen from './pages/AvatarGen';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<IPPositioning />} />
          <Route path="/benchmark" element={<Benchmark />} />
          <Route path="/script" element={<ScriptFactory />} />
          <Route path="/avatar" element={<AvatarGen />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
