'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
    deliveryDate: ''
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      router.push('/cart');
    }
    setCart(savedCart);
  }, [router]);

  const total = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        },
        items: cart.map(item => ({
          flower: item._id,
          quantity: item.quantity,
          price: item.salePrice
        })),
        totalAmount: total,
        note: formData.note,
        deliveryDate: formData.deliveryDate || undefined
      };

      await axios.post('/api/orders', orderData);
      
      // Clear cart and redirect
      localStorage.removeItem('cart');
      alert('Order placed successfully!');
      router.push('/');
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} id="checkout-form">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                required
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                required
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Delivery Date (Optional)</label>
              <input
                type="datetime-local"
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Note</label>
              <textarea
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          </form>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <ul className="divide-y divide-gray-200 mb-4">
              {cart.map((item) => (
                <li key={item._id} className="flex justify-between py-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{((item.salePrice || 0) * item.quantity).toLocaleString()} ₫</span>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{total.toLocaleString()} ₫</span>
            </div>
            
            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full mt-6 bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
