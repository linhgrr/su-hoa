'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';

import Pagination from '@/components/Pagination';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    fetchMaterials(pagination.page);
  }, [pagination.page]);

  const fetchMaterials = async (page: number) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/materials?page=${page}&limit=${pagination.limit}`);
      setMaterials(res.data.data);
      setPagination(prev => ({ ...prev, ...res.data.pagination }));
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/materials', formData);
      setShowModal(false);
      setFormData({ name: '', unit: '', description: '', image: '' });
      fetchMaterials(pagination.page);
      toast.success('Material created successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create material');
    }
  };

  const [showLotModal, setShowLotModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [lotData, setLotData] = useState({
    quantityImport: 0,
    importPrice: 0,
    expireDate: '',
    supplier: '',
  });

  const handleImportLot = (material: any) => {
    setSelectedMaterial(material);
    setLotData({ quantityImport: 0, importPrice: 0, expireDate: '', supplier: '' });
    setShowLotModal(true);
  };

  const submitLot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/api/materials/${selectedMaterial._id}/lots`, lotData);
      setShowLotModal(false);
      toast.success('Lot imported successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to import lot');
    }
  };

  const [showViewLotsModal, setShowViewLotsModal] = useState(false);
  const [materialLots, setMaterialLots] = useState([]);

  const handleViewLots = async (material: any) => {
    setSelectedMaterial(material);
    try {
      const res = await axios.get(`/api/materials/${material._id}/lots`);
      setMaterialLots(res.data);
      setShowViewLotsModal(true);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch lots');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Materials Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pastel-green hover:bg-green-100 text-pastel-green-dark px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} /> Add Material
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50/50">
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-64" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-8 w-48 rounded-lg" /></td>
                </tr>
              ))
            ) : (
              materials.map((material: any) => (
                <tr key={material._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{material.name}</td>
                  <td className="px-6 py-4 text-gray-600">{material.unit}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{material.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-3">
                    <button 
                      onClick={() => handleImportLot(material)}
                      className="text-pastel-purple-dark hover:text-purple-700 font-medium text-sm transition-colors"
                    >
                      Import Lot
                    </button>
                    <button 
                      onClick={() => handleViewLots(material)}
                      className="text-pastel-green-dark hover:text-green-700 font-medium text-sm transition-colors"
                    >
                      View Lots
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex gap-3 pt-3 border-t border-gray-50">
                <Skeleton className="h-9 w-full rounded-xl" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            </div>
          ))
        ) : (
          materials.map((material: any) => (
            <div key={material._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{material.name}</h3>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md mt-1 inline-block">
                    Unit: {material.unit}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description}</p>
              
              <div className="flex gap-3 pt-3 border-t border-gray-50">
                <button 
                  onClick={() => handleImportLot(material)}
                  className="flex-1 py-2 bg-purple-50 text-pastel-purple-dark rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  Import Lot
                </button>
                <button 
                  onClick={() => handleViewLots(material)}
                  className="flex-1 py-2 bg-green-50 text-pastel-green-dark rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
                >
                  View Lots
                </button>
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
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md m-4">
            <h2 className="text-xl font-bold mb-4">Add New Material</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <ImageUpload 
                  onUpload={(url) => setFormData({ ...formData, image: url })}
                  currentImage={formData.image}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLotModal && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md m-4">
            <h2 className="text-xl font-bold mb-4">Import Lot for {selectedMaterial?.name}</h2>
            <form onSubmit={submitLot}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  className="w-full border rounded p-2"
                  value={lotData.quantityImport}
                  onChange={e => setLotData({ ...lotData, quantityImport: Number(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Import Price</label>
                <input
                  type="number"
                  required
                  className="w-full border rounded p-2"
                  value={lotData.importPrice}
                  onChange={e => setLotData({ ...lotData, importPrice: Number(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Expire Date</label>
                <input
                  type="date"
                  required
                  className="w-full border rounded p-2"
                  value={lotData.expireDate}
                  onChange={e => setLotData({ ...lotData, expireDate: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Supplier</label>
                <input
                  className="w-full border rounded p-2"
                  value={lotData.supplier}
                  onChange={e => setLotData({ ...lotData, supplier: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowLotModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Import</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewLotsModal && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Lots for {selectedMaterial?.name}</h2>
              <button onClick={() => setShowViewLotsModal(false)} className="text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Import Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expire Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Import</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Remain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Import Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {materialLots.length > 0 ? (
                    materialLots.map((lot: any) => (
                      <tr key={lot._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(lot.importDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(lot.expireDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{lot.quantityImport}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold">{lot.quantityRemain}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{lot.importPrice.toLocaleString()} ₫</td>
                        <td className="px-6 py-4 whitespace-nowrap">{lot.supplier}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No lots found for this material.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
