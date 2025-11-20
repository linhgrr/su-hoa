'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    const newCart = cart.map(item => item._id === id ? { ...item, quantity: newQty } : item);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item._id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/" className="text-pink-600 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item._id} className="flex py-6 px-4 sm:px-6">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={item.mainImage || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.name}</h3>
                    <p className="ml-4">{((item.salePrice || 0) * item.quantity).toLocaleString()} ₫</p>
                  </div>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <div className="flex items-center border rounded">
                    <button 
                      className="px-2 py-1 hover:bg-gray-100"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    >-</button>
                    <span className="px-2">{item.quantity}</span>
                    <button 
                      className="px-2 py-1 hover:bg-gray-100"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >+</button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
                    className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        <div className="bg-white p-6 rounded-lg shadow w-full sm:w-1/3">
          <div className="flex justify-between mb-4 text-lg font-bold">
            <span>Total</span>
            <span>{total.toLocaleString()} ₫</span>
          </div>
          <Link 
            href="/checkout"
            className="block w-full bg-pink-600 text-white text-center py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
