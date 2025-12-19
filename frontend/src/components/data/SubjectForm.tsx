import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useYears, useRooms, useInstructors } from '../../hooks/useData';
import { DAYS, SLOTS, type Subject } from '../../types';

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
}

export function SubjectForm({ isOpen, onClose, subject, onSave, onDelete }: SubjectFormProps) {
  const { data: years = [] } = useYears();
  const { data: rooms = [] } = useRooms();
  const { data: instructors = [] } = useInstructors();

  const [formData, setFormData] = useState({
    id: '',
    code: '',
    section: '1',
    name: '',
    credit: 3,
    workload: 3,
    splitPattern: '3',
    selectedYears: [] as string[],
    instructorAssignments: [] as { id: string; ratio: number }[],
    isFixed: false,
    fixedDay: 'MON',
    fixedStart: 0,
    fixedRoom: '',
  });

  const [totalRatio, setTotalRatio] = useState(0);

  // Load subject data when editing
  useEffect(() => {
    if (subject) {
      setFormData({
        id: subject.id,
        code: subject.code,
        section: subject.section,
        name: subject.name,
        credit: subject.credit,
        workload: subject.workload,
        splitPattern: subject.splitPattern ? subject.splitPattern.join(',') : '3',
        selectedYears: subject.year || [],
        instructorAssignments: subject.instructors || [],
        isFixed: subject.is_fixed === 1,
        fixedDay: subject.fixed_day || 'MON',
        fixedStart: subject.fixed_start || 0,
        fixedRoom: subject.fixed_room || '',
      });
    } else {
      // Reset form for new subject
      setFormData({
        id: '',
        code: '',
        section: '1',
        name: '',
        credit: 3,
        workload: 3,
        splitPattern: '3',
        selectedYears: [],
        instructorAssignments: [],
        isFixed: false,
        fixedDay: 'MON',
        fixedStart: 0,
        fixedRoom: '',
      });
    }
  }, [subject]);

  // Calculate total ratio whenever instructor assignments change
  useEffect(() => {
    const total = formData.instructorAssignments.reduce((sum, inst) => sum + inst.ratio, 0);
    setTotalRatio(total);
  }, [formData.instructorAssignments]);

  const toggleYear = (yearId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedYears: prev.selectedYears.includes(yearId)
        ? prev.selectedYears.filter((id) => id !== yearId)
        : [...prev.selectedYears, yearId],
    }));
  };

  const toggleInstructor = (instructorId: string) => {
    const isSelected = formData.instructorAssignments.some((inst) => inst.id === instructorId);

    if (isSelected) {
      // Remove instructor
      setFormData((prev) => ({
        ...prev,
        instructorAssignments: prev.instructorAssignments.filter((inst) => inst.id !== instructorId),
      }));
    } else {
      // Add instructor
      // If creating new subject, distribute ratio evenly
      const newCount = formData.instructorAssignments.length + 1;
      const evenRatio = subject ? 0 : parseFloat((100 / newCount).toFixed(2));

      if (subject) {
        // Editing: add with remaining ratio
        const remaining = 100 - totalRatio;
        setFormData((prev) => ({
          ...prev,
          instructorAssignments: [...prev.instructorAssignments, { id: instructorId, ratio: remaining }],
        }));
      } else {
        // Creating: redistribute evenly
        const redistributed = formData.instructorAssignments.map(() => ({ ratio: evenRatio }));
        setFormData((prev) => ({
          ...prev,
          instructorAssignments: [
            ...prev.instructorAssignments.map((inst, idx) => ({
              ...inst,
              ratio: evenRatio,
            })),
            { id: instructorId, ratio: evenRatio },
          ],
        }));
      }
    }
  };

  const updateInstructorRatio = (instructorId: string, ratio: number) => {
    setFormData((prev) => ({
      ...prev,
      instructorAssignments: prev.instructorAssignments.map((inst) =>
        inst.id === instructorId ? { ...inst, ratio } : inst
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.selectedYears.length === 0) {
      alert('กรุณาเลือกชั้นปีอย่างน้อย 1 กลุ่ม');
      return;
    }

    if (!formData.isFixed && formData.instructorAssignments.length > 0) {
      if (Math.abs(totalRatio - 100) > 0.1) {
        alert('สัดส่วนต้องรวมได้ 100%');
        return;
      }
    }

    // Parse split pattern
    const splitPattern = formData.splitPattern
      .split(',')
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));

    const subjectData = {
      id: formData.id || `S${Date.now()}`,
      code: formData.code,
      section: formData.section,
      name: formData.name,
      credit: formData.credit,
      workload: formData.workload,
      splitPattern: splitPattern.length > 0 ? splitPattern : [3],
      year: formData.selectedYears,
      instructors: formData.instructorAssignments,
      is_fixed: formData.isFixed ? 1 : 0,
      fixed_day: formData.isFixed ? formData.fixedDay : undefined,
      fixed_start: formData.isFixed ? formData.fixedStart : undefined,
      fixed_room: formData.isFixed ? formData.fixedRoom : undefined,
    };

    onSave(subjectData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="จัดการรายวิชา" size="xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Fixed Schedule Option */}
        <div className="flex gap-4 items-center bg-gray-50 p-2 rounded border mb-2">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
            <input
              type="checkbox"
              checked={formData.isFixed}
              onChange={(e) => setFormData({ ...formData, isFixed: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded"
            />
            วิชา Lock (Fix เวลา/ห้อง/ไม่ต้องใช้ผู้สอนในภาค)
          </label>
        </div>

        {/* Fixed Schedule Fields */}
        {formData.isFixed && (
          <div className="grid grid-cols-3 gap-4 bg-red-50 p-3 rounded border border-red-100">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">วัน</label>
              <select
                value={formData.fixedDay}
                onChange={(e) => setFormData({ ...formData, fixedDay: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                เริ่มเวลา
              </label>
              <select
                value={formData.fixedStart}
                onChange={(e) => setFormData({ ...formData, fixedStart: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                {SLOTS.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">ห้อง</label>
              <select
                value={formData.fixedRoom}
                onChange={(e) => setFormData({ ...formData, fixedRoom: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">-- ไม่ระบุ --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
              รหัสวิชา
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="CVE101"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Sec</label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="1"
              required
            />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
              ชื่อวิชา
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Engineering Drawing"
              required
            />
          </div>
        </div>

        {/* Credits & Workload */}
        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded border">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
              หน่วยกิต
            </label>
            <input
              type="number"
              value={formData.credit}
              onChange={(e) => setFormData({ ...formData, credit: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
              Workload
            </label>
            <input
              type="number"
              value={formData.workload}
              onChange={(e) =>
                setFormData({ ...formData, workload: parseFloat(e.target.value) })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              min="0"
              step="0.5"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-kmutt-orange mb-1 uppercase">
              รูปแบบคาบ (เช่น 3, 2, 1)
            </label>
            <input
              type="text"
              value={formData.splitPattern}
              onChange={(e) => setFormData({ ...formData, splitPattern: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono"
              placeholder="3"
              required
            />
          </div>
        </div>

        {/* Years Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
            ชั้นปี (เลือกได้มากกว่า 1)
          </label>
          <div className="border rounded p-2 h-32 overflow-y-auto custom-scroll bg-white grid grid-cols-4 gap-2">
            {years.map((year) => (
              <label
                key={year.id}
                className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={formData.selectedYears.includes(year.id)}
                  onChange={() => toggleYear(year.id)}
                  className="w-4 h-4 text-kmutt-orange rounded"
                />
                <span className="text-gray-700 font-bold">{year.id}</span>
                <span className="text-xs text-gray-400">({year.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Instructor Assignments */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2 flex justify-between uppercase">
            <span>ผู้สอนและสัดส่วนงาน (%)</span>
            <span
              className={`text-xs font-bold ${
                Math.abs(totalRatio - 100) < 0.1 ? 'text-green-600' : 'text-red-500'
              }`}
            >
              Total: {totalRatio.toFixed(0)}%
            </span>
          </label>
          <div className="border rounded-lg overflow-hidden flex flex-col h-48">
            <div className="bg-gray-100 px-3 py-2 text-xs font-bold text-gray-500 grid grid-cols-12 gap-2">
              <div className="col-span-1 text-center">เลือก</div>
              <div className="col-span-8">ชื่อ-สกุล</div>
              <div className="col-span-3 text-center">สัดส่วน (%)</div>
            </div>
            <div className="overflow-y-auto custom-scroll bg-white divide-y flex-1">
              {instructors
                .sort((a, b) => {
                  const aSelected = formData.instructorAssignments.some((inst) => inst.id === a.id);
                  const bSelected = formData.instructorAssignments.some((inst) => inst.id === b.id);
                  if (aSelected && !bSelected) return -1;
                  if (!aSelected && bSelected) return 1;
                  return 0;
                })
                .map((instructor) => {
                  const assignment = formData.instructorAssignments.find(
                    (inst) => inst.id === instructor.id
                  );
                  const isSelected = !!assignment;

                  return (
                    <div key={instructor.id} className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-gray-50">
                      <div className="col-span-1 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleInstructor(instructor.id)}
                          className="w-4 h-4 text-kmutt-orange rounded"
                        />
                      </div>
                      <div className="col-span-8 text-sm flex items-center">
                        {instructor.first_name} {instructor.last_name}
                        <span className="text-xs text-gray-400 ml-1">({instructor.prefix})</span>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={assignment?.ratio || ''}
                          onChange={(e) =>
                            updateInstructorRatio(instructor.id, parseFloat(e.target.value) || 0)
                          }
                          disabled={!isSelected}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-center text-xs disabled:bg-gray-100"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-2 pt-4 border-t">
          {subject && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(subject.id)}
              className="text-red-500 text-sm font-bold hover:underline"
            >
              ลบวิชา
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-kmutt-orange text-white rounded font-bold hover:bg-orange-600 shadow-sm"
            >
              บันทึก
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
