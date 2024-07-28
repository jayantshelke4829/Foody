import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import './index.css';
import HomePage from './pages/HomePage';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import Product from './components/Product';
import CartPage from './pages/CartPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/cart" element={<HomePage />} />
          <Route path="/" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product" element={<Product />} />
          {/* <Route path="/cart" element={<CartPage />} /> */}
        </Routes>
      </Router>
    </CartProvider>
  </React.StrictMode>
);
