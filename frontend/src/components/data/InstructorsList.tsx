import { useState } from 'react';
import { useInstructors, useCreateInstructor, useUpdateInstructor, useDeleteInstructor } from '../../hooks/useData';
import { Modal } from '../common/Modal';
import { DAYS, SLOTS, type Instructor, type BusySlot } from '../../types';

interface InstructorFormData {
  id: string;
  prefix: string;
  first_name: string;
  last_name: string;
  telephone: string;
  email: string;
  field: string;
  busy: BusySlot[];
}

export function InstructorsList() {
  const { data: instructors = [], isLoading } = useInstructors();
  const createInstructor = useCreateInstructor();
  const updateInstructor = useUpdateInstructor();
  const deleteInstructor = useDeleteInstructor();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [formData, setFormData] = useState<InstructorFormData>({
    id: '',
    prefix: 'อาจารย์',
    first_name: '',
    last_name: '',
    telephone: '',
    email: '',
    field: '',
    busy: [],
  });

  const handleEdit = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setFormData({
      id: instructor.id,
      prefix: instructor.prefix || 'อาจารย์',
      first_name: instructor.first_name,
      last_name: instructor.last_name || '',
      telephone: instructor.telephone || '',
      email: instructor.email || '',
      field: instructor.field || '',
      busy: instructor.busy || [],
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingInstructor(null);
    setFormData({
      id: '',
      prefix: 'อาจารย์',
      first_name: '',
      last_name: '',
      telephone: '',
      email: '',
      field: '',
      busy: [],
    });
    setIsModalOpen(true);
  };

  const toggleBusy = (day: string, slot: number) => {
    const isBusy = formData.busy.some((b) => b.day === day && b.slot === slot);

    if (isBusy) {
      setFormData({
        ...formData,
        busy: formData.busy.filter((b) => !(b.day === day && b.slot === slot)),
      });
    } else {
      setFormData({
        ...formData,
        busy: [...formData.busy, { day, slot }],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingInstructor) {
        await updateInstructor.mutateAsync({ id: editingInstructor.id, data: formData });
      } else {
        const newId = formData.id || `P${Date.now()}`;
        await createInstructor.mutateAsync({ ...formData, id: newId });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving instructor:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('ยืนยันลบอาจารย์ท่านนี้?')) {
      try {
        await deleteInstructor.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting instructor:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 flex flex-col flex-1 min-h-[300px]">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h3 className="font-bold text-purple-800 text-sm md:text-base">
          <i className="fas fa-chalkboard-teacher mr-2"></i> ผู้สอน (Instructors)
        </h3>
        <button
          onClick={handleAdd}
          className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded hover:bg-purple-100 font-bold"
        >
          + เพิ่ม
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll space-y-1 pr-1">
        {instructors.map((instructor) => (
          <div
            key={instructor.id}
            onClick={() => handleEdit(instructor)}
            className="flex justify-between items-center p-2 hover:bg-gray-50 border-b border-gray-100 last:border-0 group cursor-pointer"
          >
            <div className="truncate pr-2 w-full text-sm text-gray-700">
              <b>{instructor.first_name} {instructor.last_name}</b>{' '}
              <span className="text-xs text-gray-400 ml-1">({instructor.prefix})</span>
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
        title={editingInstructor ? 'แก้ไขข้อมูลผู้สอน' : 'เพิ่มผู้สอน'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                  คำนำหน้าชื่อ
                </label>
                <select
                  value={formData.prefix}
                  onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                >
                  <option value="อาจารย์">อาจารย์</option>
                  <option value="ดร.">ดร.</option>
                  <option value="ผู้ช่วยศาสตราจารย์">ผู้ช่วยศาสตราจารย์</option>
                  <option value="รองศาสตราจารย์">รองศาสตราจารย์</option>
                  <option value="ศาสตราจารย์">ศาสตราจารย์</option>
                  <option value="ผู้ช่วยศาสตราจารย์ ดร.">ผู้ช่วยศาสตราจารย์ ดร.</option>
                  <option value="รองศาสตราจารย์ ดร.">รองศาสตราจารย์ ดร.</option>
                  <option value="ศาสตราจารย์ ดร.">ศาสตราจารย์ ดร.</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                  สาขาวิชา
                </label>
                <select
                  value={formData.field}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                >
                  <option value="">-- ไม่ระบุ --</option>
                  <option value="วิศวกรรมโครงสร้าง">วิศวกรรมโครงสร้าง</option>
                  <option value="วิศวกรรมทรัพยากรน้ำ">วิศวกรรมทรัพยากรน้ำ</option>
                  <option value="วิศวกรรมเทคนิคธรณี">วิศวกรรมเทคนิคธรณี</option>
                  <option value="วิศวกรรมขนส่ง">วิศวกรรมขนส่ง</option>
                  <option value="วิศวกรรมสำรวจ">วิศวกรรมสำรวจ</option>
                  <option value="วิศวกรรมบริหารงานก่อสร้าง">วิศวกรรมบริหารงานก่อสร้าง</option>
                  <option value="อาจารย์พิเศษ">อาจารย์พิเศษ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">ชื่อ</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                  นามสกุล
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                  เบอร์ติดต่อ
                </label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                  E-MAIL
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                />
              </div>
            </div>

            {/* Availability Grid */}
            <div className="pt-4">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold text-red-600 uppercase">
                  <i className="far fa-calendar-times mr-1"></i> ช่วงเวลาที่ไม่สะดวก (Availability)
                </label>
                <span className="text-xs text-gray-500">คลิกเพื่อเปลี่ยนสถานะ</span>
              </div>

              <div className="border rounded-lg p-2 bg-gray-50 overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-[60px_repeat(14,1fr)] gap-1 text-[10px]">
                    <div className="text-center font-bold text-gray-400">Day</div>
                    {SLOTS.map((slot) => (
                      <div key={slot.id} className="text-center text-gray-400 font-bold">
                        {slot.label}
                      </div>
                    ))}

                    {DAYS.map((day) => (
                      <>
                        <div
                          key={`day-${day}`}
                          className="flex items-center justify-center font-bold text-gray-500"
                        >
                          {day}
                        </div>
                        {SLOTS.map((slot) => {
                          const isBusy = formData.busy.some(
                            (b) => b.day === day && b.slot === slot.id
                          );
                          return (
                            <div
                              key={`${day}-${slot.id}`}
                              onClick={() => toggleBusy(day, slot.id)}
                              className={`h-8 border rounded flex items-center justify-center cursor-pointer transition ${
                                isBusy ? 'bg-red-500' : 'bg-white hover:bg-gray-200'
                              }`}
                            ></div>
                          );
                        })}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-2">
            {editingInstructor && (
              <button
                type="button"
                onClick={() => handleDelete(editingInstructor.id)}
                className="text-red-500 text-sm font-bold hover:underline"
              >
                ลบผู้สอน
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
                className="px-6 py-2 bg-purple-600 text-white rounded font-bold hover:bg-purple-700 shadow-sm"
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
