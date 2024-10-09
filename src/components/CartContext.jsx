import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const URL = 'https://foody-backend-kjpp.onrender.com'; // Make sure this is the correct backend URL

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${URL}/api/cart`); // Make sure this matches your backend routes
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };
  

  const removeFromCart = async (idMeal) => {
    const item = cart.find((product) => product.idMeal === idMeal);
    if (item && item.quantity > 1) {
      try {
        const response = await fetch(`${URL}/api/cart/${idMeal}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: -1 }), // Decrease quantity
        });
        const updatedCart = await response.json();
        setCart(updatedCart);
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    } else {
      console.log("Cannot remove item. At least one quantity must remain.");
    }
  };

  const deleteFromCart = async (idMeal) => {
    const item = cart.find((product) => product.idMeal === idMeal);
    if (item) {
      try {
        if (item.quantity > 1) {
          const response = await fetch(`${URL}/api/cart/${idMeal}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: 0 }), // Set quantity to 0
          });
          const updatedCart = await response.json();
          setCart(updatedCart);
        } else {
          const response = await fetch(`${URL}/api/cart/${idMeal}`, {
            method: 'DELETE',
          });
          const updatedCart = await response.json();
          setCart(updatedCart);
        }
      } catch (error) {
        console.error('Failed to delete item from cart:', error);
      }
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
