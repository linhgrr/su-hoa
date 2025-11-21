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
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order: any) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order._id.slice(-6)}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                  <div className="text-sm text-gray-500">{order.customer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                  {order.totalAmount.toLocaleString()} ₫
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  {order.status === 'pending' && (
                    <button onClick={() => updateStatus(order._id, 'confirmed')} className="text-blue-600 hover:text-blue-900" title="Confirm">
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button onClick={() => updateStatus(order._id, 'delivering')} className="text-purple-600 hover:text-purple-900" title="Deliver">
                      <Truck size={18} />
                    </button>
                  )}
                  {order.status === 'delivering' && (
                    <button onClick={() => updateStatus(order._id, 'done')} className="text-green-600 hover:text-green-900" title="Complete">
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {['pending', 'confirmed'].includes(order.status) && (
                    <button onClick={() => updateStatus(order._id, 'cancelled')} className="text-red-600 hover:text-red-900" title="Cancel">
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
