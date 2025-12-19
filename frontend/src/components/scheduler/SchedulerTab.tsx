import { useState } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { ClassPool } from './ClassPool';
import { RoomSelectModal } from './RoomSelectModal';
import { useSessions, useSyncSessions, useAutoAssign, useUpdateSession, useSubjects, useDeptConstraints, useSettings, useInstructors } from '../../hooks/useData';

export function SchedulerTab() {
  const [filter, setFilter] = useState('ALL');
  const [pendingDrop, setPendingDrop] = useState<{
    sessionId: string;
    day: string;
    startSlot: number;
  } | null>(null);

  const { data: sessions = [] } = useSessions();
  const { data: subjects = [] } = useSubjects();
  const { data: deptConstraints = [] } = useDeptConstraints();
  const { data: settings } = useSettings();
  const { data: instructors = [] } = useInstructors();
  const syncMutation = useSyncSessions();
  const autoAssignMutation = useAutoAssign();
  const updateSession = useUpdateSession();

  // Calculate unassigned sessions count
  const unassignedCount = sessions.filter(s => !s.day || !s.start_slot).length;

  const handleSync = async () => {
    try {
      const result = await syncMutation.mutateAsync();
      alert(result.message || 'Sessions synced successfully!');
    } catch (error: any) {
      alert(`Error syncing sessions: ${error.message}`);
    }
  };

  const handleAutoAssign = async () => {
    if (!confirm('เริ่มจัดตารางอัตโนมัติสำหรับรายวิชาที่เหลือ?\n(วิชาที่จัดตารางไปแล้วจะไม่ถูกย้าย)')) {
      return;
    }

    try {
      const result = await autoAssignMutation.mutateAsync();
      alert(result.message || 'Auto-assign completed!');
    } catch (error: any) {
      alert(`Error auto-assigning: ${error.message}`);
    }
  };

  const handleDrop = (day: string, startSlot: number, sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const subject = subjects.find(s => s.id === session.subject_id);
    if (!subject) return;

    // Check if exceeds time limit (14 slots max, ending at 22:30)
    if (startSlot + session.duration > 14) {
      alert('เกินเวลาทำการ (22:30)');
      return;
    }

    // Check if subject is fixed
    if (subject.is_fixed) {
      alert('วิชานี้ Lock เวลาไว้แล้ว');
      return;
    }

    // Check department constraints
    const checkDept = settings?.check_dept_constraints ?? 1;
    if (checkDept && deptConstraints.length > 0) {
      const constraint = deptConstraints.find(c => c.day === day);
      if (constraint) {
        for (let i = 0; i < session.duration; i++) {
          const slot = startSlot + i;
          if (constraint.hard_blocked?.[slot]) {
            alert(`ช่วงเวลานี้ห้ามจัดตาราง (Hard Block)`);
            return;
          }
          if (constraint.soft_blocked?.[slot]) {
            if (!confirm(`ช่วงเวลานี้ไม่แนะนำให้จัด (Soft Block) - ต้องการจัดหรือไม่?`)) {
              return;
            }
          }
        }
      }
    }

    // Check instructor availability
    const checkInstr = settings?.check_instructor_constraints ?? 1;
    if (checkInstr && subject.instructors && subject.instructors.length > 0) {
      for (const subjectInstructor of subject.instructors) {
        const instructor = instructors.find(i => i.id === subjectInstructor.id);
        if (instructor?.availability) {
          const avail = instructor.availability[day];
          if (avail) {
            for (let i = 0; i < session.duration; i++) {
              const slot = startSlot + i;
              if (avail[slot] === false) {
                alert(`อาจารย์ ${instructor.first_name} ไม่ว่างในช่วงเวลานี้`);
                return;
              }
            }
          }
        }
      }
    }

    // Open room selection modal
    setPendingDrop({ sessionId, day, startSlot });
  };

  const handleRoomSelect = (roomId: string) => {
    if (!pendingDrop) return;

    updateSession.mutate({
      id: pendingDrop.sessionId,
      data: {
        day: pendingDrop.day,
        start_slot: pendingDrop.startSlot,
        room_id: roomId,
      }
    });

    setPendingDrop(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-2 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-800">
            <i className="fas fa-calendar-alt text-kmutt-orange mr-2"></i> จัดตารางสอน
          </h2>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded text-sm">
            <span className="text-gray-500 font-bold px-2">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent font-medium text-gray-700 outline-none cursor-pointer"
            >
              <option value="ALL">แสดงทั้งหมด</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={syncMutation.isPending}
            className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-xs font-bold border border-blue-200 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className={`fas ${syncMutation.isPending ? 'fa-spinner fa-spin' : 'fa-sync'} mr-1`}></i>{' '}
            Sync Sessions
          </button>
          <button className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded text-xs font-bold border border-gray-300 transition flex items-center">
            <i className="fas fa-cog mr-1"></i> ตั้งค่า
          </button>
          <button
            onClick={handleAutoAssign}
            disabled={autoAssignMutation.isPending || unassignedCount === 0}
            className="text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded text-xs font-bold border border-indigo-200 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className={`fas ${autoAssignMutation.isPending ? 'fa-spinner fa-spin' : 'fa-robot'} mr-1`}></i>{' '}
            Auto-Assign
          </button>
          <button className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-xs font-bold border border-red-200 transition flex items-center">
            <i className="fas fa-trash-alt mr-1"></i> Reset All
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Class Pool Sidebar */}
        <div className="w-72 bg-white border-r flex flex-col shadow-lg z-10 flex-shrink-0">
          <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
            <span className="font-bold text-gray-700 text-sm">Class Pool (รอจัด)</span>
            <span className="bg-kmutt-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unassignedCount}
            </span>
          </div>
          <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scroll bg-gray-50/50">
            <ClassPool onDragStart={() => {}} />
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto custom-scroll bg-white relative">
          <div className="p-6">
            <CalendarGrid onDrop={handleDrop} />
          </div>
        </div>
      </div>

      {/* Room Selection Modal */}
      {pendingDrop && (
        <RoomSelectModal
          isOpen={true}
          onClose={() => setPendingDrop(null)}
          onSelect={handleRoomSelect}
          sessionId={pendingDrop.sessionId}
          day={pendingDrop.day}
          startSlot={pendingDrop.startSlot}
          duration={sessions.find(s => s.id === pendingDrop.sessionId)?.duration || 0}
        />
      )}
    </div>
  );
}
