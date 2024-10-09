import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const URL = 'https://foody-backend-kjpp.onrender.com'; // Ensure this is the correct backend URL

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${URL}/api/cart`); // Ensure this matches your backend routes
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (item) => {
    try {
      const response = await fetch(`${URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idMeal: item.idMeal,
          name: item.strMeal,
          price: item.price,
          quantity: 1,
          strMealThumb: item.strMealThumb,
          strMeal: item.strMeal,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const removeFromCart = async (idMeal) => {
    const item = cart.find((product) => product.idMeal === idMeal);
    if (item) {
      try {
        const newQuantity = item.quantity > 1 ? item.quantity - 1 : 0;

        const response = await fetch(`${URL}/api/cart/${idMeal}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: newQuantity }), // Update quantity
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const updatedCart = await response.json();
        setCart(updatedCart);
      } catch (error) {
        console.error('Failed to update item quantity:', error);
      }
    }
  };

  const deleteFromCart = async (idMeal) => {
    try {
      const response = await fetch(`${URL}/api/cart/${idMeal}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to delete item from cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      const response = await fetch(`${URL}/api/save-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      });
      
      console.log("Response status:", response.status); // Log the response status
      console.log("Response headers:", response.headers.get('content-type')); // Log the response type
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log(result.message); // 'Cart saved successfully'
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };
  

  const getTotalItems = () => {
    return Array.isArray(cart) ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
  };

  const getCartTotal = () => {
    return Array.isArray(cart)
      ? cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
      : '0.00';
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, getTotalItems, getCartTotal, deleteFromCart, saveCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
