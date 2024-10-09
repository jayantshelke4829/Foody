import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const URL = 'https://foody-backend-kjpp.onrender.com'; // Backend URL

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${URL}/api/cart`);
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
    // Check if the item has valid values
    if (!item.idMeal || !item.strMeal || !item.price || item.quantity <= 0 || !item.strMealThumb) {
      console.error('Invalid item:', item);
      return; // Exit the function early if the item is not valid
    }
  
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
    
    if (item) {
      try {
        if (item.quantity > 1) {
          const response = await fetch(`${URL}/api/cart/${idMeal}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: -1 }), // Decrease quantity
          });
          
          const updatedCart = await response.json();
          setCart(updatedCart);
        } else {
          console.log("Cannot remove item. At least one quantity must remain.");
        }
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    } else {
      console.log('Item not found in cart');
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
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const updatedCart = await response.json();
          setCart(updatedCart);
        } else {
          const response = await fetch(`${URL}/api/cart/${idMeal}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
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
      for (const item of cart) {
        await addToCart(item); // Use addToCart logic to save the cart
      }
      console.log('Cart saved successfully');
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const getTotalItems = () => {
    return Array.isArray(cart)
      ? cart.reduce((total, item) => {
          const quantity = parseInt(item.quantity, 10); // Ensure quantity is a number
          return total + (isNaN(quantity) ? 0 : quantity); // Check for NaN
        }, 0)
      : 0;
  };
  
  const getCartTotal = () => {
    return Array.isArray(cart)
      ? cart.reduce((total, item) => {
          const price = parseFloat(item.price); // Ensure price is a number
          const quantity = parseInt(item.quantity, 10); // Ensure quantity is a number
          return total + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity); // Check for NaN
        }, 0)
        .toFixed(2) // Format to two decimal places
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
