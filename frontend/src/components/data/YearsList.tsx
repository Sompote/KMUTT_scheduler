import { useState } from 'react';
import { useYears, useCreateYear, useUpdateYear, useDeleteYear } from '../../hooks/useData';
import { Modal } from '../common/Modal';
import type { Year } from '../../types';

interface YearFormData {
  id: string;
  name: string;
  count: number;
}

export function YearsList() {
  const { data: years = [], isLoading } = useYears();
  const createYear = useCreateYear();
  const updateYear = useUpdateYear();
  const deleteYear = useDeleteYear();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<Year | null>(null);
  const [formData, setFormData] = useState<YearFormData>({
    id: '',
    name: '',
    count: 45,
  });

  const handleEdit = (year: Year) => {
    setEditingYear(year);
    setFormData({
      id: year.id,
      name: year.name,
      count: year.count,
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingYear(null);
    setFormData({
      id: '',
      name: '',
      count: 45,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingYear) {
        await updateYear.mutateAsync({ id: editingYear.id, data: formData });
      } else {
        await createYear.mutateAsync(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving year:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('ยืนยันลบชั้นปีนี้?')) {
      try {
        await deleteYear.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting year:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 flex flex-col h-1/3 min-h-[250px]">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h3 className="font-bold text-blue-800 text-sm md:text-base">
          <i className="fas fa-user-graduate mr-2"></i> ชั้นปี (Years)
        </h3>
        <button
          onClick={handleAdd}
          className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-bold"
        >
          + เพิ่ม
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll space-y-1 pr-1">
        {years.map((year) => (
          <div
            key={year.id}
            onClick={() => handleEdit(year)}
            className="flex justify-between items-center p-2 hover:bg-gray-50 border-b border-gray-100 last:border-0 group cursor-pointer"
          >
            <div className="truncate pr-2 w-full text-sm text-gray-700">
              <b>{year.id}</b> : {year.name}{' '}
              <span className="text-xs text-gray-400 font-light">(จำนวน {year.count} คน)</span>
            </div>
            <button className="text-gray-300 group-hover:text-kmutt-orange opacity-0 group-hover:opacity-100 transition flex-shrink-0">
              <i className="fas fa-edit"></i>
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingYear ? 'แก้ไขชั้นปี' : 'เพิ่มชั้นปี'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                ID / Code
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                placeholder="TH-B1A"
                required
                disabled={!!editingYear}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                ชื่อ (Name)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                placeholder="ป.ตรี (ปกติ) ปี 1 (A)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                จำนวนนักศึกษา
              </label>
              <input
                type="number"
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                min="1"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-2">
            {editingYear && (
              <button
                type="button"
                onClick={() => handleDelete(editingYear.id)}
                className="text-red-500 text-sm font-bold hover:underline"
              >
                ลบชั้นปี
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 shadow-sm"
              >
                บันทึก
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
