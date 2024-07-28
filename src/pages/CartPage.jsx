import React from 'react';
import { useCart } from '../components/CartContext';

const CartPage = () => {
  const { cart, addToCart, removeFromCart, getCartTotal, getTotalItems } = useCart();

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Cart Items</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item) => (
            <li key={item.idMeal} className="bg-white rounded-lg shadow-lg p-4 flex justify-between items-center">
              <div>
                <img src={item.strMealThumb} alt={item.strMeal} className="w-20 h-20 object-cover rounded-lg mb-2" />
                <h3 className="text-xl font-semibold">{item.strMeal}</h3>
                <p className="text-gray-600">Price: ${item.price}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => removeFromCart(item.idMeal)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg"
                >
                  -
                </button>
                <p>{item.quantity}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                >
                  +
                </button>
              </div>
            </li>
          ))}
          <hr />
          <div className="text-right mt-4 font-semibold">
            Total Items: {getTotalItems()}
            <br />
            Total Price: ${getCartTotal()}
          </div>
        </ul>
      )}
    </div>
  );
};

export default CartPage;
