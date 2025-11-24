'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import Pagination from '@/components/Pagination';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    frequency: 'monthly',
    startDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    fetchExpenses(pagination.page);
  }, [pagination.page]);

  const fetchExpenses = async (page: number) => {
    try {
      const res = await axios.get(`/api/expenses?page=${page}&limit=${pagination.limit}`);
      setExpenses(res.data.data);
      setPagination(prev => ({ ...prev, ...res.data.pagination }));
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch expenses');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/expenses', formData);
      setShowModal(false);
      fetchExpenses(pagination.page);
      toast.success('Expense added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add expense');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await axios.delete(`/api/expenses?id=${id}`);
      fetchExpenses(pagination.page);
      toast.success('Expense deleted successfully');
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Fixed Expenses</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pastel-peach hover:bg-orange-100 text-pastel-peach-dark px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} /> Add Expense
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50/50">
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Frequency</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {expenses.map((expense: any) => (
              <tr key={expense._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{expense.name}</td>
                <td className="px-6 py-4 font-bold text-gray-800">{expense.amount.toLocaleString()} ₫</td>
                <td className="px-6 py-4 capitalize text-gray-600">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">{expense.frequency}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{format(new Date(expense.startDate), 'dd/MM/yyyy')}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(expense._id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {expenses.map((expense: any) => (
          <div key={expense._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{expense.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md capitalize">
                    {expense.frequency}
                  </span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(expense.startDate), 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
              <p className="font-bold text-lg text-gray-800">{expense.amount.toLocaleString()} ₫</p>
            </div>
            
            <div className="flex justify-end pt-3 border-t border-gray-50">
              <button 
                onClick={() => handleDelete(expense._id)} 
                className="flex items-center gap-2 px-4 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md m-4 border border-gray-100">
 <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Expense</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-pastel-peach-dark focus:border-transparent"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  required
                  className="w-full border rounded p-2"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select
                  className="w-full border rounded p-2"
                  value={formData.frequency}
                  onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  className="w-full border rounded p-2"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-pastel-peach hover:bg-orange-100 text-pastel-peach-dark rounded-xl font-medium transition-colors shadow-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
