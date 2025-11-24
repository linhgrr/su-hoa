'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-30 flex items-center px-4">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} className="text-gray-600" />
        </button>
        <span className="ml-3 font-bold text-gray-800">Admin Panel</span>
      </div>

      <AdminSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />
      
      <main 
        className={`
          flex-1 p-4 md:p-8 transition-all duration-300 mt-16 md:mt-0
          ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}
        `}
      >
        {children}
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
