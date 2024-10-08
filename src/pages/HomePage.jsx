import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import "./Home.css";

const HomePage = () => {
  const { cart, addToCart, removeFromCart, getCartTotal, getTotalItems, deleteFromCart } =
    useCart();

  // Function to send the cart data to the backend
  const saveCartToBackend = async (cartData) => {
    try {
      const response = await fetch("http://localhost:5000/save-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: cartData }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Cart saved successfully:", data);
      } else {
        console.error("Error saving cart:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Save the cart to the backend whenever the cart changes
  useEffect(() => {
    if (cart.length > 0) {
      saveCartToBackend(cart);
    }
  }, [cart]);

  return (
    <div className="bg-gray-100 min-h-screen p-6 bg-[url('https://e1.pxfuel.com/desktop-wallpaper/511/370/desktop-wallpaper-design-food-backgrounds-black-food.jpg')] bg-fixed bg-no-repeat bg-cover">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <h1 className="text-3xl font-bold mb-4 text-slate-800">Cart</h1>
      <Link to="/" className="underline mb-4 inline-block">
        <button className="bg-none shadow-lg button rounded-md p-2">
          Go to home
        </button>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {/* Your shop items here */}
      </div>
      <h2 className="text-2xl cards font-bold mb-4">Cart Items</h2>
      {Array.isArray(cart) && cart.length === 0 ? (
  <p>Your cart is empty.</p>
) : (
  <ul className="space-y-4 backdrop-blur-sm w-full">
    {Array.isArray(cart) && cart.map((item) => (
      <li key={item.idMeal} className="bg-white bg-opacity-25 rounded-lg shadow-lg p-4 flex justify-between items-center ">
        <div className='bg-slate-400 bg-opacity-80 p-4 rounded-lg shadow-lg'>
          <Link to={`/product/${item.idMeal}`}>
            <img src={item.strMealThumb} alt={item.strMeal} className="w-20 object-cover rounded-lg mb-2" />
          </Link>
          <h3 className="text-xl font-semibold">{item.strMeal}</h3>
          <p className="text-gray-600">Price: ${item.price}</p>
          <p className="text-gray-600">Quantity: {item.quantity}</p>
        </div>
        <div className="flex items-center space-x-2">
        { item.quantity === 1 ? (
          <button
            onClick={() => {deleteFromCart(item.idMeal), removed}}
            className=" bg-slate-600 text-white py-2 hover:text-red-500 px-4 rounded-lg shadow-lg"
          >
           <i className="fa fa-lg fa-trash"></i>
           </button>
        ):(
          <button
            onClick={() => removeFromCart(item.idMeal)}
            className="bg-slate-600 text-white py-2 hover:text-blue-500 px-4 rounded-lg shadow-lg"
          >
            -
          </button>
        )}
          <p className='text-white'>{item.quantity}</p>
          <button
            onClick={() => addToCart(item)}
            className="bg-slate-600 hover:text-blue-500 text-white py-2 px-4 rounded-lg shadow-lg"
          >
            +
          </button>
          <button
            onClick={() => {deleteFromCart(item.idMeal), removed}}
            className=" bg-slate-600 text-white py-2 hover:text-red-500 px-4 rounded-lg shadow-lg"
          >
           <i className="fa fa-lg fa-trash"></i>
           </button>
        </div>
      </li>
    ))}
    <hr />
    <div className="text-right mt-4 text-white font-semibold">
      Total Items: {getTotalItems()}
      <br />
      Total Price: ${getCartTotal()}
    </div>
  </ul>
)}

    </div>
  );
};

export default HomePage;
