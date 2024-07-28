import React from 'react';
import { useCart } from './CartContext';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique keys

const TestCartContext = () => {
  const { cart, addToCart, getCartTotal } = useCart();

  return (
    <div>
      <h2>Test Cart Context</h2>
      <p>Cart Total: ${getCartTotal()}</p>
      <ul>
        {cart.map((item) => (
          <li key={uuidv4()}>{item.strMeal} - ${item.price}</li>
        ))}
      </ul>
      <button onClick={() => addToCart({ idMeal: '1', strMeal: 'Test Item', price: '10.00' })}>
        Add Test Item to Cart
      </button>
    </div>
  );
};

export default TestCartContext;
