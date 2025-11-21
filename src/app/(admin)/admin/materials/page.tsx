'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import toast from 'react-hot-toast';

import Pagination from '@/components/Pagination';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
      const res = await axios.get(`/api/materials?page=${page}&limit=${pagination.limit}`);
      setMaterials(res.data.data);
      setPagination(prev => ({ ...prev, ...res.data.pagination }));
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch materials');
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Materials Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} /> Add Material
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materials.map((material: any) => (
              <tr key={material._id}>
                <td className="px-6 py-4 whitespace-nowrap">{material.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{material.unit}</td>
                <td className="px-6 py-4">{material.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => handleImportLot(material)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Import Lot
                  </button>
                  <button 
                    onClick={() => handleViewLots(material)}
                    className="text-green-600 hover:text-green-800"
                  >
                    View Lots
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination 
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
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
          <div className="bg-white p-6 rounded-lg w-96">
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
