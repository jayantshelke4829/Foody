import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import {  useNavigate } from 'react-router-dom';


const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        const productData = data.meals ? data.meals[0] : null;
        if (productData) {
          productData.price = localStorage.getItem(productData.idMeal) || 'No price available';
        }
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    console.log('Added to cart:', product);
    navigate('/cart')
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex items-center justify-center bg-[url('https://e1.pxfuel.com/desktop-wallpaper/511/370/desktop-wallpaper-design-food-backgrounds-black-food.jpg')] bg-fixed bg-no-repeat bg-cover">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto bg-opacity-50 backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-4">{product.strMeal}</h2>
        <img
          src={product.strMealThumb}
          alt={product.strMeal}
          className="w-full h-80 object-cover rounded-lg mb-4"
        />
        <p className="text-xl font-semibold mb-2">Price: ${product.price}</p>
        <p className="text-gray-800 mb-4">{product.strInstructions || 'No description available.'}</p>
        <button
          onClick={handleAddToCart}
          className="bg-slate-700 hover:bg-green-700 text-white mr-10 py-2 px-4 rounded-lg transition duration-300"
        >
          Add to Cart
        </button>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mt-4 inline-block transition duration-300"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
