'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';

interface DashboardStats {
  revenue: number;
  orders: number;
  profit: number;
  customers: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    orders: 0,
    profit: 0,
    customers: 0,
    recentOrders: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

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
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">{stats.revenue.toLocaleString()} ₫</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-2xl font-bold">{stats.orders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Net Profit</p>
            <p className="text-2xl font-bold">{stats.profit.toLocaleString()} ₫</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Customers</p>
            <p className="text-2xl font-bold">{stats.customers}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{order.customer?.name || 'Guest'}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{order.totalAmount.toLocaleString()} ₫</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent orders.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Low Stock Alert</h2>
          <p className="text-gray-500">Inventory looks good.</p>
        </div>
      </div>
    </div>
  );
}
