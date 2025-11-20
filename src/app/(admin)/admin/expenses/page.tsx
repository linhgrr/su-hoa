'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    frequency: 'monthly',
    startDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('/api/expenses');
      setExpenses(res.data);
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
      fetchExpenses();
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
      fetchExpenses();
      toast.success('Expense deleted successfully');
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fixed Expenses</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} /> Add Expense
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense: any) => (
              <tr key={expense._id}>
                <td className="px-6 py-4">{expense.name}</td>
                <td className="px-6 py-4 font-bold">{expense.amount.toLocaleString()} ₫</td>
                <td className="px-6 py-4 capitalize">{expense.frequency}</td>
                <td className="px-6 py-4">{format(new Date(expense.startDate), 'dd/MM/yyyy')}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(expense._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  required
                  className="w-full border rounded p-2"
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
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
