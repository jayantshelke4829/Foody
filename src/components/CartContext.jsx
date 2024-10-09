import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const URL = 'https://foody-backend-kjpp.onrender.com/api'; // Include `/api`

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await fetch('https://foody-backend-kjpp.onrender.com/api/cart');
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };
  const saveCartToBackend = async (cartData) => {
    try {
      const response = await fetch('http://localhost:5000/api/save-cart', { // Include /api
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart: cartData }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Cart saved successfully:', data);
      } else {
        console.error('Error saving cart:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
    

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (item) => {
    try {
      const response = await fetch(`${URL}/cart`, {
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
          strMeal: item.strMeal
        }),
      });
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
        const response = await fetch(`${URL}/cart/${idMeal}`, {
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
          const response = await fetch(`${URL}/cart/${idMeal}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: 0 }), // Set quantity to 0
          });
          const updatedCart = await response.json();
          setCart(updatedCart);
        } else {
          const response = await fetch(`${URL}/cart/${idMeal}`, {
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
      value={{ cart, addToCart, removeFromCart, getTotalItems, getCartTotal, deleteFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
