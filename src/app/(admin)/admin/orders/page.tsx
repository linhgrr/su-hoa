'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Eye, CheckCircle, Truck, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import Pagination from '@/components/Pagination';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchOrders(pagination.page);
  }, [pagination.page]);

  const fetchOrders = async (page: number) => {
    try {
      const res = await axios.get(`/api/orders?page=${page}&limit=${pagination.limit}`);
      setOrders(res.data.data);
      setPagination(prev => ({ ...prev, ...res.data.pagination }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to update status to ${status}?`)) return;
    try {
      await axios.put(`/api/orders/${id}/status`, { status });
      fetchOrders(pagination.page);
      toast.success(`Order status updated to ${status}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update status';
      console.error('Status update error:', error.response?.data);
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'delivering': return 'bg-purple-100 text-purple-800';
      case 'done': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Orders Management</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50/50">
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {orders.map((order: any) => (
              <tr key={order._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600">#{order._id.slice(-6)}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-800">{order.customer.name}</div>
                  <div className="text-xs text-gray-500">{order.customer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                  {order.totalAmount.toLocaleString()} ₫
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  {order.status === 'pending' && (
                    <button onClick={() => updateStatus(order._id, 'confirmed')} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Confirm">
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button onClick={() => updateStatus(order._id, 'delivering')} className="text-purple-500 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors" title="Deliver">
                      <Truck size={18} />
                    </button>
                  )}
                  {order.status === 'delivering' && (
                    <button onClick={() => updateStatus(order._id, 'done')} className="text-green-500 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition-colors" title="Complete">
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {['pending', 'confirmed'].includes(order.status) && (
                    <button onClick={() => updateStatus(order._id, 'cancelled')} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                      <XCircle size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination 
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />
    </div>
  );
}
