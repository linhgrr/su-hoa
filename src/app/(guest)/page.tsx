'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function HomePage() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const res = await axios.get('/api/flowers');
        setFlowers(res.data);
      } catch (error) {
        console.error('Error fetching flowers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlowers();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Fresh Flowers for Every Occasion</h1>
        <p className="text-lg text-gray-600">Hand-picked and arranged with love.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {flowers.map((flower: any) => (
          <div key={flower._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
              <img
                src={flower.mainImage || 'https://via.placeholder.com/300'}
                alt={flower.name}
                className="h-64 w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{flower.name}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{flower.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-xl font-bold text-pink-600">{(flower.salePrice || 0).toLocaleString()} ₫</p>
                <button 
                  className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm hover:bg-pink-700 transition-colors"
                  onClick={() => {
                    // Simple cart logic using localStorage for demo
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const existing = cart.find((item: any) => item._id === flower._id);
                    if (existing) {
                      existing.quantity += 1;
                    } else {
                      cart.push({ ...flower, quantity: 1 });
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    alert('Added to cart!');
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
