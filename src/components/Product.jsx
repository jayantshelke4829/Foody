import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import {  useNavigate } from 'react-router-dom';
import './Product.css'


const Product = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();


  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevents the click event from propagating to parent elements
    addToCart(product);
    navigate('/cart')

    console.log('Added to cart:', product);
  };

  return (
    <div className="card bg-opacity-45 w-80  mt-10 bg-black rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
      <Link to={`/product/${product.idMeal}`}>
        <img
          src={product.strMealThumb}
          alt={product.strMeal}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 bg-opacity-50 backdrop-blur-sm bg-slate-200">
          <h3 className="text-xl font-semibold mb-2">{product.strMeal}</h3>
          <p className="text-gray-600 mb-2">Price: ${product.price}</p>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        className="bg-slate-700 hover:bg-green-700 text-white py-2 px-4 rounded-b-lg w-full transition duration-300"
      >
        Add to Cart
      </button>

    </div>
  );
};

export default Product;
