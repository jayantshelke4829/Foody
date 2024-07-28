import React, { useState, useEffect } from 'react';
import Product from './Product';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();
      const productsWithPrices = (data.meals || []).map(product => ({
        ...product,
        price: localStorage.getItem(product.idMeal) || (Math.random() * 10 + 5).toFixed(2)
      }));
      setProducts(productsWithPrices);
      productsWithPrices.forEach(product => {
        localStorage.setItem(product.idMeal, product.price);
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts('');
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchProducts(searchQuery.trim());
  };

  return (
    <div className="bg-black  text-gray-800 min-h-screen bg-[url('https://e1.pxfuel.com/desktop-wallpaper/511/370/desktop-wallpaper-design-food-backgrounds-black-food.jpg')] bg-fixed bg-no-repeat bg-cover">
    
      {/* Hero Section */}
      <header className="relative bg-cover bg-center h-[60vh] bg-[url('https://i.graphicmama.com/blog/wp-content/uploads/2021/05/20072323/Free-Food-PowerPoint-Template-31.png')] shadow-[0px_20px_20px_10px_#1a202c] bg-fixed">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto flex flex-col items-center justify-center h-full text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Healthy Meals for a Better Life</h1>
          <p className="text-lg mb-6">Discover our range of nutritious meals and recipes</p>
          <form onSubmit={handleSearchSubmit} className="flex justify-center gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for meals..."
              className="bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700 placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-slate-600 hover:bg-slate-700 hover:text-blue-500 text-white py-2 px-4 rounded-lg transition duration-300"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}

      <main className="container mx-auto p-6 lg:pl-28 ">

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  gap-6 ">
            {products.length > 0 ? (
              products.map((product) => (
                <Product
                  key={product.idMeal}
                  product={product}
                />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <div className='flex flex-col min-h-screen'>
      <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Healthy Meals. All rights reserved.</p>
          <p>123 Health St, Wellness City, HW 12345</p>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default Shop;
