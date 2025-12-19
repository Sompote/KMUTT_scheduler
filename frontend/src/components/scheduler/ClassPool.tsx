import { useSubjects, useSessions, useSyncSessions } from '../../hooks/useData';

interface ClassPoolProps {
  onDragStart: (sessionId: string) => void;
}

export function ClassPool({ onDragStart }: ClassPoolProps) {
  const { data: subjects = [] } = useSubjects();
  const { data: sessions = [] } = useSessions();
  const syncMutation = useSyncSessions();

  // Calculate unassigned sessions (sessions that don't have a scheduled time)
  const unassignedSessions = sessions.filter(s => !s.day || !s.start_slot);

  const handleSync = async () => {
    try {
      const result = await syncMutation.mutateAsync();
      alert(result.message || 'Sessions synced successfully!');
    } catch (error: any) {
      alert(`Error syncing sessions: ${error.message}`);
    }
  };

  // If no sessions exist yet, show message about needing to sync subjects
  if (sessions.length === 0) {
    return (
      <div className="text-center text-gray-400 text-sm mt-8 px-4">
        <i className="fas fa-inbox text-4xl mb-3 block text-gray-300"></i>
        <p>ยังไม่มีคาบเรียนที่รอจัดตาราง</p>
        <p className="text-xs mt-2">
          คาบเรียนจะถูกสร้างอัตโนมัติจากรายวิชาในแท็บ "ข้อมูลพื้นฐาน"
        </p>
        <p className="text-xs mt-1 text-kmutt-orange font-bold">
          จำนวนรายวิชา: {subjects.length} วิชา
        </p>
        {subjects.length > 0 && (
          <button
            onClick={handleSync}
            disabled={syncMutation.isPending}
            className="mt-4 bg-kmutt-orange text-white px-4 py-2 rounded text-xs font-bold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className={`fas ${syncMutation.isPending ? 'fa-spinner fa-spin' : 'fa-sync'} mr-2`}></i>
            {syncMutation.isPending ? 'กำลังสร้างคาบเรียน...' : 'สร้างคาบเรียนจากรายวิชา'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {unassignedSessions.length === 0 ? (
        <div className="text-center text-gray-400 text-sm mt-8">
          <i className="fas fa-check-circle text-4xl mb-3 block text-green-400"></i>
          <p>จัดตารางครบแล้ว! 🎉</p>
          <p className="text-xs mt-2">ทุกคาบเรียนถูกจัดลงตารางเรียบร้อยแล้ว</p>
        </div>
      ) : (
        unassignedSessions.map((session) => {
          const subject = subjects.find(s => s.id === session.subject_id);
          if (!subject) return null;

          // Color based on year (same as original)
          const firstYear = subject.year?.[0];
          const colors = [
            'border-l-blue-500',
            'border-l-green-500',
            'border-l-yellow-500',
            'border-l-pink-500',
            'border-l-purple-500',
          ];
          const colorClass = colors[0]; // Would need year index calculation

          return (
            <div
              key={session.id}
              draggable
              onDragStart={(e) => {
                onDragStart(session.id);
                e.dataTransfer.setData('text/plain', session.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              className={`draggable-item bg-white p-3 rounded border-l-4 ${colorClass} shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing relative group`}
            >
              <div className="flex justify-between">
                <span className="font-bold text-gray-800 text-sm">
                  {subject.code}-{subject.section}
                </span>
                <span className="text-[10px] bg-gray-200 px-1.5 rounded font-bold">
                  {session.duration} ชม.
                </span>
              </div>
              <div className="text-xs text-gray-600 truncate">{subject.name}</div>
              {firstYear && (
                <div className="text-[10px] text-gray-400 mt-1">
                  ชั้นปี: {subject.year?.join(', ')}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
