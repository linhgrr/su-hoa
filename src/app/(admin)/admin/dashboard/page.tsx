'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingBag, TrendingUp, Users, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface DashboardStats {
  revenue: number;
  orders: number;
  profit: number;
  customers: number;
  recentOrders: any[];
  charts?: {
    monthlyRevenue: number[];
    monthlyExpenses: number[];
    orderStatusDistribution: {
      pending: number;
      confirmed: number;
      delivering: number;
      done: number;
      cancelled: number;
    };
  };
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
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'delivering': return 'bg-purple-100 text-purple-700';
      case 'done': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Chart Data - Using real data from API
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: stats.charts?.monthlyRevenue || Array(12).fill(0),
        borderColor: '#3CD856',
        backgroundColor: 'rgba(60, 216, 86, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3CD856',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Expenses',
        data: stats.charts?.monthlyExpenses || Array(12).fill(0),
        borderColor: '#FF947A',
        backgroundColor: 'transparent',
        tension: 0.4,
        borderDash: [5, 5],
        pointRadius: 0,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          font: { size: 12 },
          padding: 15,
          color: '#6B7280'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6' },
        ticks: { font: { size: 11 }, color: '#9ca3af' }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: '#9ca3af' }
      }
    }
  };

  // Order Status Distribution for Donut Chart
  const statusDist = stats.charts?.orderStatusDistribution;
  const totalStatusOrders = statusDist 
    ? statusDist.pending + statusDist.confirmed + statusDist.delivering + statusDist.done + statusDist.cancelled
    : 1;

  const donutData = {
    labels: ['Pending', 'Confirmed', 'Delivering', 'Done', 'Cancelled'],
    datasets: [
      {
        data: statusDist 
          ? [statusDist.pending, statusDist.confirmed, statusDist.delivering, statusDist.done, statusDist.cancelled]
          : [0, 0, 0, 0, 0],
        backgroundColor: ['#FFF4DE', '#E0F2FE', '#F3E8FF', '#DCFCE7', '#FFE2E5'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">Welcome back, Admin</div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Earnings - Pink */}
        <div className="bg-pastel-pink p-6 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-white/50 rounded-full text-pastel-pink-dark">
                <DollarSign size={18} />
              </div>
              <span className="text-gray-700 text-sm font-medium">Total Revenue</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.revenue.toLocaleString()} ₫</p>
          </div>
          {/* Decorative background shape */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
        </div>
        
        {/* Total Orders - Green */}
        <div className="bg-pastel-green p-6 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-white/50 rounded-full text-pastel-green-dark">
                <ShoppingBag size={18} />
              </div>
              <span className="text-gray-700 text-sm font-medium">Total Orders</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.orders}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
        </div>

        {/* Profit - Cyan/Purple */}
        <div className="bg-pastel-purple p-6 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-white/50 rounded-full text-pastel-purple-dark">
                <TrendingUp size={18} />
              </div>
              <span className="text-gray-700 text-sm font-medium">Net Profit</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.profit.toLocaleString()} ₫</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
        </div>

        {/* Customers - Peach */}
        <div className="bg-pastel-peach p-6 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-white/50 rounded-full text-pastel-peach-dark">
                <Users size={18} />
              </div>
              <span className="text-gray-700 text-sm font-medium">Customers</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.customers}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Revenue Overview</h2>
            <button className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
              {new Date().getFullYear()} <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="h-64">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* Side Widget (Donut or List) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Order Status</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-48 flex justify-center items-center relative">
             <Doughnut 
                data={donutData} 
                options={{ 
                  cutout: '70%', 
                  plugins: { legend: { display: false } } 
                }} 
              />
              <div className="absolute text-center">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-xl font-bold text-gray-800">{stats.orders}</p>
              </div>
          </div>
          <div className="mt-6 space-y-3">
            {statusDist && (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFF4DE]"></div>
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="text-sm font-medium">{statusDist.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E0F2FE]"></div>
                    <span className="text-sm text-gray-600">Confirmed</span>
                  </div>
                  <span className="text-sm font-medium">{statusDist.confirmed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pastel-purple"></div>
                    <span className="text-sm text-gray-600">Delivering</span>
                  </div>
                  <span className="text-sm font-medium">{statusDist.delivering}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pastel-green"></div>
                    <span className="text-sm text-gray-600">Done</span>
                  </div>
                  <span className="text-sm font-medium">{statusDist.done}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pastel-pink"></div>
                    <span className="text-sm text-gray-600">Cancelled</span>
                  </div>
                  <span className="text-sm font-medium">{statusDist.cancelled}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          <button className="text-sm text-emerald-600 font-medium hover:underline">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <tr key={order._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-medium text-gray-700">{order.customer?.name || 'Guest'}</td>
                    <td className="py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="py-4 font-bold text-gray-800">{order.totalAmount.toLocaleString()} ₫</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
