'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Flower, Package, ShoppingCart, Settings, DollarSign } from 'lucide-react';

const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/materials', label: 'Materials', icon: Package },
    { path: '/admin/flowers', label: 'Flowers', icon: Flower },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/expenses', label: 'Expenses', icon: DollarSign },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white h-screen p-6 fixed left-0 top-0 border-r border-gray-100 flex flex-col">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
          <Flower size={20} />
        </div>
        <h1 className="text-xl font-bold text-gray-800">By Bloom</h1>
      </div>
      
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link 
              key={item.path}
              href={item.path} 
              className={`
                flex items-center space-x-3 p-3 rounded-xl transition-colors duration-200
                ${active 
                  ? 'bg-sidebar-active text-sidebar-text-active font-medium' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon size={20} className={active ? 'text-sidebar-text-active' : 'text-gray-400'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="px-3 py-2">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2">Account</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div>
              <p className="text-sm font-medium text-gray-700">Admin</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
