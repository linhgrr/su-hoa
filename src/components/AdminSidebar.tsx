import Link from 'next/link';
import { LayoutDashboard, Flower, Package, ShoppingCart, Settings, DollarSign } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 fixed left-0 top-0">
      <h1 className="text-2xl font-bold mb-8 text-center">Flower Shop</h1>
      <nav className="space-y-2">
        <Link href="/admin/dashboard" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-800">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/admin/materials" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-800">
          <Package size={20} />
          <span>Materials</span>
        </Link>
        <Link href="/admin/flowers" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-800">
          <Flower size={20} />
          <span>Flowers</span>
        </Link>
        <Link href="/admin/orders" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-800">
          <ShoppingCart size={20} />
          <span>Orders</span>
        </Link>
        <Link href="/admin/expenses" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-800">
          <DollarSign size={20} />
          <span>Expenses</span>
        </Link>
        <Link href="/admin/settings" className="flex items-center space-x-3 p-3 rounded hover:bg-gray-800">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
