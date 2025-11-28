'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';

import Pagination from '@/components/Pagination';

export default function FlowersPage() {
  const [flowers, setFlowers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9, // 3 columns x 3 rows
    total: 0,
    totalPages: 0
  });
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    salePrice: 0,
    mainImage: '',
    recipe: [] as { material: string; quantity: number }[]
  });

  useEffect(() => {
    fetchData(pagination.page);
  }, [pagination.page]);

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const [flowersRes, materialsRes] = await Promise.all([
        axios.get(`/api/flowers?page=${page}&limit=${pagination.limit}`),
        axios.get('/api/materials')
      ]);
      setFlowers(flowersRes.data.data);
      setPagination(prev => ({ ...prev, ...flowersRes.data.pagination }));
      setMaterials(materialsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipeItem = () => {
    setFormData({
      ...formData,
      recipe: [...formData.recipe, { material: '', quantity: 1 }]
    });
  };

  const handleRecipeChange = (index: number, field: string, value: any) => {
    const newRecipe = [...formData.recipe];
    newRecipe[index] = { ...newRecipe[index], [field]: value };
    setFormData({ ...formData, recipe: newRecipe });
  };

  const handleRemoveRecipeItem = (index: number) => {
    const newRecipe = formData.recipe.filter((_, i) => i !== index);
    setFormData({ ...formData, recipe: newRecipe });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/flowers', formData);
      setShowModal(false);
      setFormData({ name: '', description: '', salePrice: 0, mainImage: '', recipe: [] });
      fetchData(pagination.page);
      toast.success('Flower created successfully');
    } catch (error) {
      console.error('Error creating flower:', error);
      toast.error('Failed to create flower');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Flowers Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pastel-purple hover:bg-purple-100 text-pastel-purple-dark px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} /> Add Flower
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
              </div>
            </div>
          ))
        ) : (
          flowers.map((flower: any) => (
            <div key={flower._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <img 
                src={flower.mainImage || 'https://via.placeholder.com/300'} 
                alt={flower.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{flower.name}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{flower.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-pastel-purple-dark">
                    {(flower.salePrice || 0).toLocaleString()} ₫
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    Cost: {flower.baseCost?.toLocaleString() || 0} ₫
                  </span>
                </div>
                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <button 
                    onClick={async () => {
                      if (confirm('Delete this flower?')) {
                          try {
                          await axios.delete(`/api/flowers/${flower._id}`);
                          fetchData(pagination.page);
                          toast.success('Flower deleted successfully');
                        } catch (error) {
                          toast.error('Failed to delete flower');
                        }
                      }
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <Pagination 
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4 z-50">
          <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl my-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Flower</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-pastel-purple-dark focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price</label>
                  <input
                    type="number"
                    required
                    className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-pastel-purple-dark focus:border-transparent"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <ImageUpload 
                  onUpload={(url) => setFormData({ ...formData, mainImage: url })}
                  currentImage={formData.mainImage}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-pastel-purple-dark focus:border-transparent min-h-[80px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Recipe</label>
                  <button
                    type="button"
                    onClick={handleAddRecipeItem}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Material
                  </button>
                </div>
                {formData.recipe.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      className="flex-1 border rounded-md p-2"
                      value={item.material}
                      onChange={(e) => handleRecipeChange(index, 'material', e.target.value)}
                      required
                    >
                      <option value="">Select Material</option>
                      {materials.map((m: any) => (
                        <option key={m._id} value={m._id}>{m.name} ({m.unit})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="w-24 border rounded-md p-2"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleRecipeChange(index, 'quantity', Number(e.target.value))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-pastel-purple hover:bg-purple-100 text-pastel-purple-dark rounded-xl font-medium transition-colors shadow-sm"
                >
                  Save Flower
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
