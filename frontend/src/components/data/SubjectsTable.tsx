import { useState } from 'react';
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from '../../hooks/useData';
import { SubjectForm } from './SubjectForm';
import type { Subject } from '../../types';

export function SubjectsTable() {
  const { data: subjects = [], isLoading } = useSubjects();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingSubject) {
        await updateSubject.mutateAsync({ id: editingSubject.id, data });
      } else {
        await createSubject.mutateAsync(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving subject:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('ยืนยันลบรายวิชานี้?')) {
      try {
        await deleteSubject.mutateAsync(id);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error deleting subject:', error);
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-center h-full">
        <div className="text-center text-gray-500">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="font-bold text-gray-800 text-lg">
          <i className="fas fa-book mr-2 text-kmutt-orange"></i> รายวิชา (Subjects)
        </h3>
        <button
          onClick={handleAdd}
          className="bg-kmutt-orange text-white px-4 py-2 rounded shadow hover-kmutt-orange text-sm font-bold"
        >
          <i className="fas fa-plus mr-1"></i> เพิ่มรายวิชา
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll relative">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 text-left w-24">รหัส</th>
              <th className="px-4 py-3 text-left w-20">Section</th>
              <th className="px-4 py-3 text-left">ชื่อวิชา</th>
              <th className="px-4 py-3 text-center w-20">หน่วยกิต</th>
              <th className="px-4 py-3 text-center w-24">Workload</th>
              <th className="px-4 py-3 text-left">ผู้สอน (สัดส่วน)</th>
              <th className="px-4 py-3 text-left w-56">ชั้นปี</th>
              <th className="px-4 py-3 text-center w-20">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {subjects.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  ยังไม่มีรายวิชา - คลิก "เพิ่มรายวิชา" เพื่อเริ่มต้น
                </td>
              </tr>
            ) : (
              subjects.map((subject) => (
                <tr
                  key={subject.id}
                  className="group hover:bg-orange-50 transition border-b border-gray-100 cursor-pointer"
                  onClick={() => handleEdit(subject)}
                >
                  <td className="px-4 py-3 font-mono font-bold text-gray-700">
                    {subject.code}
                    {subject.is_fixed && (
                      <span className="bg-gray-600 text-white text-[10px] px-1 rounded ml-1">
                        FIX
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-center">{subject.section}</td>
                  <td className="px-4 py-3">{subject.name}</td>
                  <td className="px-4 py-3 text-center">{subject.credit}</td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {subject.workload || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {subject.instructors && subject.instructors.length > 0
                      ? subject.instructors.map((inst) => `${inst.id} (${inst.ratio}%)`).join(', ')
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {subject.year && subject.year.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {subject.year.map((yearId) => (
                          <span
                            key={yearId}
                            className="inline-block bg-gray-100 rounded px-1 text-xs border border-gray-300 text-gray-700 font-bold"
                          >
                            {yearId}
                          </span>
                        ))}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(subject);
                      }}
                      className="text-gray-400 group-hover:text-kmutt-orange transition"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Subject Form Modal */}
      <SubjectForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subject={editingSubject}
        onSave={handleSave}
        onDelete={editingSubject ? handleDelete : undefined}
      />
    </div>
  );
}
