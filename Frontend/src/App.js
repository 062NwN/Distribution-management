import { Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Testes from './components/models/PurchaseConfirmed';

import Dashboard from './pages/Dashboard';
import Products from './pages//NewProduct';
import Box from './pages/Box';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
      </header>

      <div className='body'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/box" element={<Box />} />

          <Route path="/login" element={<Dashboard />} />
          <Route path="/testes" element={<Testes />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;