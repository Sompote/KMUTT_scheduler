import { YearsList } from './YearsList';
import { RoomsList } from './RoomsList';
import { InstructorsList } from './InstructorsList';
import { SubjectsTable } from './SubjectsTable';
import { useAcadYear, useUpdateAcadYear } from '../../hooks/useData';
import { useState } from 'react';

export function DataManagement() {
  const { data: acadYear = '2/2568' } = useAcadYear();
  const updateAcadYear = useUpdateAcadYear();
  const [yearInput, setYearInput] = useState(acadYear);

  const handleYearChange = (value: string) => {
    setYearInput(value);
  };

  const handleYearSave = async () => {
    try {
      await updateAcadYear.mutateAsync(yearInput);
    } catch (error) {
      console.error('Error updating academic year:', error);
    }
  };

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="max-w-[1920px] mx-auto w-full h-full flex flex-col">
        <div className="mb-4 border-b pb-2 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">จัดการข้อมูล (Data Management)</h2>
            <p className="text-sm text-gray-500">
              จัดการข้อมูลพื้นฐาน คำนวณภาระงาน และกำหนดทรัพยากร
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-gray-600">ปีการศึกษา:</label>
            <input
              type="text"
              value={yearInput}
              onChange={(e) => handleYearChange(e.target.value)}
              onBlur={handleYearSave}
              className="border rounded p-1 text-sm w-24 text-center font-bold text-kmutt-orange focus:outline-none focus:border-kmutt-orange"
            />
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left Sidebar - Years, Rooms, Instructors */}
          <div className="w-1/5 flex flex-col gap-4 overflow-hidden">
            <YearsList />
            <RoomsList />
            <InstructorsList />
          </div>

          {/* Main Content - Subjects Table */}
          <div className="w-4/5">
            <SubjectsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
