import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.idMeal === item.idMeal);
      if (existingItem) {
        return prevCart.map((i) =>
          i.idMeal === item.idMeal ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (idMeal) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.idMeal === idMeal);
      if (existingItem.quantity === 1) {
        return prevCart.filter((i) => i.idMeal !== idMeal);
      }
      return prevCart.map((i) =>
        i.idMeal === idMeal ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, getTotalItems, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
