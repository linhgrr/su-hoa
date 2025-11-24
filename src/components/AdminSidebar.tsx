'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Flower, Package, ShoppingCart, Settings, DollarSign, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const AdminSidebar = ({ isOpen, setIsOpen, isMobileOpen, setIsMobileOpen }: AdminSidebarProps) => {
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

  const sidebarClasses = `
    bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col transition-all duration-300 z-40
    ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
    ${isOpen ? 'md:w-64' : 'md:w-20'}
  `;

  return (
    <div className={sidebarClasses}>
      {/* Header */}
      <div className={`flex items-center gap-2 mb-10 px-6 pt-6 ${!isOpen && 'md:justify-center md:px-2'}`}>
        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
          <Flower size={20} />
        </div>
        <h1 className={`text-xl font-bold text-gray-800 whitespace-nowrap transition-opacity duration-300 ${!isOpen && 'md:hidden'}`}>
          By Bloom
        </h1>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden ml-auto text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="space-y-2 flex-1 px-3">
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
                ${!isOpen && 'md:justify-center'}
              `}
              title={!isOpen ? item.label : ''}
            >
              <Icon size={20} className={`shrink-0 ${active ? 'text-sidebar-text-active' : 'text-gray-400'}`} />
              <span className={`whitespace-nowrap transition-opacity duration-300 ${!isOpen && 'md:hidden'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle */}
      <div className="mt-auto pt-6 border-t border-gray-100 pb-6">
        {/* Desktop Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex w-full items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        <div className={`px-3 py-2 ${!isOpen && 'md:hidden'}`}>
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2">Account</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-700 truncate">Admin</p>
              <p className="text-xs text-gray-500 truncate">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
