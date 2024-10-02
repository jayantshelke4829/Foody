import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/save-cart', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({cart}),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      // Handle data as needed
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };
  

  useEffect(() => {
    // Fetch the cart from the backend when the component mounts
    const fetchCart = async () => {
      const response = await fetch('http://localhost:5000/cart');
      const data = await response.json();
      setCart(data);
    };

    fetchCart();
  }, []);

  const addToCart = async (item) => {
  const response = await fetch('http://localhost:5000/cart', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      idMeal: item.idMeal,
      name: item.strMeal, // Ensure this is correct
      price: item.price,
      quantity: 1,
      strMealThumb: item.strMealThumb // Make sure image is passed
    }),
  });
  const updatedCart = await response.json();
  setCart(updatedCart);
};

const removeFromCart = async (idMeal) => {
  const item = cart.find((product) => product.idMeal === idMeal);

  if (item) {
    // Check if the quantity is greater than 1
    if (item.quantity > 1) {
      // Decrease the quantity by 1
      const response = await fetch(`http://localhost:5000/cart/${idMeal}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: -1 }), // Decrease quantity
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
    } else {
      // If quantity is 1, do not allow deletion. Optionally, you can show a message.
      console.log("Cannot remove item. At least one quantity must remain.");
    }
  }
};


const deleteFromCart = async (idMeal) => {
  const item = cart.find((product) => product.idMeal === idMeal);

  if (item) {
    if (item.quantity > 1) {
      const response = await fetch(`http://localhost:5000/cart/${idMeal}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: 0 }), // Decrease quantity
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
    } else {
      const response = await fetch(`http://localhost:5000/cart/${idMeal}`, {
        method: 'DELETE',
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
    }
  }
}



const getTotalItems = () => {
  // Ensure cart is an array before calling reduce
  return Array.isArray(cart) ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
};

const getCartTotal = () => {
  // Ensure cart is an array before calling reduce
  return Array.isArray(cart) ? cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2) : '0.00';
};


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotalItems, getCartTotal, fetchCart, deleteFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
