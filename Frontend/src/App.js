import { Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar'

import Dashboard from './pages/Dashboard';
import Products from './pages/NewProduct';

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

          <Route path="/login" element={<Dashboard />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;