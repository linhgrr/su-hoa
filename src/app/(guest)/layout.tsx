import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-bold text-2xl text-pink-600">
              FlowerShop
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="text-gray-600 hover:text-gray-900 relative">
                <ShoppingCart size={24} />
                {/* Cart badge could go here */}
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                <User size={24} />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
