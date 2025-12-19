import { useMemo } from 'react';
import { useAcadYear, useRooms, useSessions, useSubjects, useInstructors } from '../../hooks/useData';
import { DAYS, SLOTS } from '../../types';

export function RoomReport() {
  const { data: acadYear } = useAcadYear();
  const { data: rooms = [] } = useRooms();
  const { data: sessions = [] } = useSessions();
  const { data: subjects = [] } = useSubjects();
  const { data: instructors = [] } = useInstructors();

  // Get room schedule
  const getRoomSchedule = (roomId: string) => {
    const schedule: Record<string, any[]> = {};

    DAYS.forEach(day => {
      const daySessions = sessions.filter(s =>
        s.day === day && s.room_id === roomId && s.start_slot !== null
      );
      schedule[day] = daySessions;
    });

    return schedule;
  };

  // Get rooms that have at least one session assigned
  const roomsWithSessions = useMemo(() => {
    return rooms.filter(room =>
      sessions.some(s => s.room_id === room.id && s.day && s.start_slot !== null)
    );
  }, [rooms, sessions]);

  return (
    <div className="h-full overflow-y-auto p-6 bg-white">
      <div className="max-w-[280mm] mx-auto space-y-6">
        {/* Controls */}
        <div className="bg-gray-100 p-4 rounded border flex justify-between items-center no-print">
          <h3 className="font-bold text-gray-700">รายงานการใช้ห้องเรียน (Room Usage)</h3>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="bg-kmutt-orange text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange-600 transition"
            >
              <i className="fas fa-print mr-2"></i>
              พิมพ์รายงาน
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center border-b-2 border-kmutt-orange pb-4">
          <div className="text-xl font-bold text-kmutt-orange">
            มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี
          </div>
          <div className="text-lg font-bold text-gray-800 mt-1">
            ภาควิชาวิศวกรรมโยธา คณะวิศวกรรมศาสตร์
          </div>
          <div className="text-md text-gray-600 mt-1">
            รายงานการใช้ห้องเรียน ภาคการศึกษา{' '}
            <span className="font-bold">{acadYear || '2/2568'}</span>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {roomsWithSessions.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <i className="fas fa-door-open text-6xl mb-4 text-gray-300"></i>
              <h3 className="text-xl font-bold text-gray-500 mb-2">ยังไม่มีข้อมูลการใช้ห้อง</h3>
              <p className="text-sm text-gray-400">
                จัดตารางสอนในแท็บ "จัดตารางสอน" ก่อนเพื่อดูรายงานการใช้ห้อง
              </p>
              <p className="text-xs text-gray-400 mt-2">
                ระบบจะแสดงตารางการใช้ห้องแต่ละห้องตลอดทั้งสัปดาห์
              </p>
            </div>
          ) : (
            roomsWithSessions.map(room => {
              const schedule = getRoomSchedule(room.id);

              return (
                <div
                  key={room.id}
                  className="bg-white rounded border overflow-hidden break-inside-avoid mb-6 p-4 shadow-sm"
                >
                  <h4 className="font-bold text-lg text-green-800 mb-2">
                    {room.name}{' '}
                    <span className="text-sm text-gray-500">({room.capacity} seats)</span>
                  </h4>

                  {/* Weekly Schedule */}
                  <div className="border rounded text-xs mt-2">
                    {/* Header */}
                    <div className="grid grid-cols-[60px_repeat(14,1fr)] bg-gray-100 text-[10px] text-center">
                      <div className="p-1 text-[10px] font-bold">Day</div>
                      {SLOTS.map((slot) => (
                        <div key={slot.id} className="p-1 border-l">
                          {slot.label}
                        </div>
                      ))}
                    </div>

                    {/* Days */}
                    {DAYS.map((day) => {
                      const daySessions = schedule[day] || [];

                      return (
                        <div
                          key={day}
                          className="grid grid-cols-[60px_repeat(14,1fr)] border-b h-10 relative"
                        >
                          <div className="p-1 font-bold text-gray-500 text-center flex items-center justify-center text-[10px] bg-gray-50">
                            {day}
                          </div>
                          {SLOTS.map((_, i) => (
                            <div key={i} className="border-l"></div>
                          ))}

                          {/* Sessions */}
                          {daySessions.map((session) => {
                            const subject = subjects.find(s => s.id === session.subject_id);
                            if (!subject) return null;

                            const firstInstructor = subject.instructors?.[0];
                            const instructor = firstInstructor
                              ? instructors.find(i => i.id === firstInstructor.id)
                              : null;

                            const start = session.start_slot;
                            const width = session.duration;

                            return (
                              <div
                                key={session.id}
                                className="absolute bg-green-100 border-l-2 border-green-600 text-[9px] p-1 overflow-hidden leading-tight"
                                style={{
                                  left: `calc(60px + ${(start * 100) / 14}%)`,
                                  width: `calc(${(width * 100) / 14}%)`,
                                  top: '1px',
                                  bottom: '1px',
                                }}
                              >
                                <div className="font-bold truncate text-[10px]">
                                  {subject.code}-{subject.section} {subject.name}
                                </div>
                                <div className="truncate text-[8px] text-gray-600">
                                  {instructor?.prefix || ''} {instructor?.first_name || '?'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
