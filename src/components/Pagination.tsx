import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl hover:bg-pastel-green hover:text-pastel-green-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-500"
      >
        <ChevronLeft size={20} />
      </button>
      
      <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl hover:bg-pastel-green hover:text-pastel-green-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-500"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
