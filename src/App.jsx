import React from 'react';
import { useCart } from './components/CartContext';

const App = () => {
  const { cart, addToCart, removeFromCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const handleRemoveFromCart = (idMeal) => {
    removeFromCart(idMeal);
  };

  return (
    <div>
      <h1>My Shopping Cart</h1>
      <ul>
        {cart.map((item) => (
          <li key={item.idMeal}>
            {item.strMeal} - {item.quantity}
            <button onClick={() => handleRemoveFromCart(item.idMeal)}>Remove</button>
          </li>
        ))}
      </ul>
      {/* Example usage */}
      <button onClick={() => handleAddToCart({ idMeal: '12345', strMeal: 'Sample Meal', quantity: 1 })}>
        Add Sample Meal
      </button>
    </div>
  );
};

export default App;
