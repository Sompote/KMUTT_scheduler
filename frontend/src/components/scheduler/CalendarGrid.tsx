import { useMemo } from 'react';
import { useSessions, useSubjects, useRooms, useInstructors, useYears, useUpdateSession } from '../../hooks/useData';
import { DAYS, SLOTS } from '../../types';
import './calendar.css';

interface PositionedSession {
  session: any;
  start: number;
  end: number;
  row: number;
}

interface CalendarGridProps {
  onDrop: (day: string, startSlot: number, sessionId: string) => void;
}

export function CalendarGrid({ onDrop }: CalendarGridProps) {
  const { data: sessions = [] } = useSessions();
  const { data: subjects = [] } = useSubjects();
  const { data: rooms = [] } = useRooms();
  const { data: instructors = [] } = useInstructors();
  const { data: years = [] } = useYears();
  const updateSession = useUpdateSession();

  // Group sessions by day and calculate positioning
  const sessionsByDay = useMemo(() => {
    const grouped: Record<string, PositionedSession[]> = {};

    DAYS.forEach(day => {
      // Filter sessions assigned to this day
      const daySessions = sessions.filter(s => s.day === day && s.start_slot !== null);

      // Calculate row positions to avoid overlap
      const rows: PositionedSession[] = [];
      daySessions.forEach(session => {
        const start = session.start_slot;
        const end = start + session.duration;

        // Find first available row
        let r = 0;
        while (rows.some(item =>
          item.row === r && !(end <= item.start || start >= item.end)
        )) {
          r++;
        }

        rows.push({ session, start, end, row: r });
      });

      grouped[day] = rows;
    });

    return grouped;
  }, [sessions]);

  const getSubject = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    return subjects.find(s => s.id === session?.subject_id);
  };

  const getRoom = (roomId: string | null) => {
    if (!roomId) return null;
    return rooms.find(r => r.id === roomId);
  };

  const getInstructor = (instructorId: string) => {
    return instructors.find(i => i.id === instructorId);
  };

  const checkConflict = (day: string, positioned: PositionedSession): boolean => {
    const daySessions = sessionsByDay[day] || [];
    const subject = getSubject(positioned.session.id);
    if (!subject) return false;

    const subjectYears = (Array.isArray(subject.year) ? subject.year : (subject.year ? [subject.year] : [])).filter(Boolean) as string[];
    const subjectInstructorIds = Array.isArray(subject.instructors)
      ? subject.instructors.map((i: any) => i.id)
      : [];

    for (const other of daySessions) {
      if (other.session.id === positioned.session.id) continue;

      // Check if sessions overlap in time
      if (positioned.start < other.end && positioned.end > other.start) {
        const otherSubject = getSubject(other.session.id);
        if (!otherSubject) continue;

        const otherYears = (Array.isArray(otherSubject.year) ? otherSubject.year : (otherSubject.year ? [otherSubject.year] : [])).filter(Boolean) as string[];
        const otherInstructorIds = Array.isArray(otherSubject.instructors)
          ? otherSubject.instructors.map((i: any) => i.id)
          : [];

        // Check for conflicts
        // 1. Same room
        if (positioned.session.room_id === other.session.room_id && positioned.session.room_id) {
          return true;
        }

        // 2. Same year
        if (subjectYears.some(y => otherYears.includes(y))) {
          return true;
        }

        // 3. Same instructor
        if (subjectInstructorIds.some(id => otherInstructorIds.includes(id))) {
          return true;
        }
      }
    }

    return false;
  };

  return (
    <div className="min-w-[1200px] pb-10">
      {/* Header Row */}
      <div className="calendar-row sticky top-0 z-30 shadow-sm bg-gray-400 h-8 border-b border-gray-400 flex">
        <div className="day-header bg-gray-300 text-black font-bold border-r border-gray-400 text-xs flex items-center justify-center w-20">
          DAY
        </div>
        <div className="slots-container bg-white">
          {SLOTS.map((slot) => (
            <div
              key={slot.id}
              className="slot-col border-r border-gray-200 text-center text-xs font-bold text-black py-1 bg-gray-300 border-gray-400 flex items-center justify-center"
            >
              {slot.label}
            </div>
          ))}
        </div>
      </div>

      {/* Day Rows */}
      {DAYS.map((day) => {
        const dayPositioned = sessionsByDay[day] || [];
        const maxRow = dayPositioned.length > 0 ? Math.max(...dayPositioned.map(p => p.row)) : -1;
        const rowHeight = Math.max(80, (maxRow + 1) * 40 + 20);

        return (
          <div
            key={day}
            className="calendar-row relative"
            style={{ height: `${rowHeight}px` }}
          >
            {/* Day Label */}
            <div className="day-header bg-gray-200 font-bold text-gray-800 flex items-center justify-center border-r border-gray-300">
              {day}
            </div>

            {/* Time Slots Container */}
            <div
              className="slots-container bg-white relative w-full"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const slotWidth = rect.width / 14;
                const slotIndex = Math.floor(x / slotWidth);
                if (slotIndex >= 0 && slotIndex < 14) {
                  const draggedSessionId = e.dataTransfer.getData('text/plain');
                  if (draggedSessionId) {
                    onDrop(day, slotIndex, draggedSessionId);
                  }
                }
              }}
            >
              {/* Slot Grid */}
              {SLOTS.map((slot) => (
                <div
                  key={slot.id}
                  className="slot-col drop-zone h-full border-r border-gray-100"
                  data-day={day}
                  data-slot={slot.id}
                ></div>
              ))}

              {/* Sessions */}
              {dayPositioned.map((positioned) => {
                const subject = getSubject(positioned.session.id);
                if (!subject) return null;

                const room = getRoom(positioned.session.room_id);
                const firstInstructor = subject.instructors?.[0];
                const instructor = firstInstructor ? getInstructor(firstInstructor.id) : null;

                const top = 5 + (positioned.row * 36);
                const conflict = checkConflict(day, positioned);

                // Color coding by year
                const firstYear = Array.isArray(subject.year) ? subject.year[0] : subject.year;
                const yearIdx = years.findIndex(y => y.id === firstYear);
                const bgColors = [
                  'bg-blue-100 border-blue-500',
                  'bg-green-100 border-green-500',
                  'bg-yellow-100 border-yellow-500',
                  'bg-pink-100 border-pink-500',
                  'bg-purple-100 border-purple-500'
                ];
                const normalColor = subject.is_fixed
                  ? 'bg-gray-600 border-gray-800 text-white'
                  : (bgColors[yearIdx % bgColors.length] || 'bg-gray-100 border-gray-500');
                const colorClass = conflict
                  ? 'bg-red-100 border-red-500 text-red-900'
                  : normalColor;

                return (
                  <div
                    key={positioned.session.id}
                    className="absolute px-1"
                    style={{
                      gridColumn: `${positioned.start + 1} / span ${positioned.session.duration}`,
                      top: `${top}px`,
                      height: '32px',
                      width: '100%',
                    }}
                  >
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', positioned.session.id);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      className={`h-full ${colorClass} border-l-4 rounded shadow-sm text-[10px] px-1 cursor-grab active:cursor-grabbing hover:shadow-md overflow-hidden flex items-center justify-between group relative border border-gray-200 z-10 hover:z-20`}
                    >
                      <div className="flex items-center gap-1 w-[calc(100%-16px)] overflow-hidden flex-nowrap">
                        <span className="font-bold whitespace-nowrap text-[10px]">
                          {subject.code}-{subject.section}
                        </span>
                        <span>:</span>
                        <span className="truncate text-[10px] font-bold" title={subject.name}>
                          {subject.name}
                        </span>
                        <span className="opacity-75 font-normal whitespace-nowrap text-[9px] ml-1">
                          | {room?.name || '?'} | {instructor?.first_name || ''}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('ยกเลิกการจัดตารางคาบนี้?')) {
                            updateSession.mutate({
                              id: positioned.session.id,
                              data: { day: null, start_slot: null, room_id: null }
                            });
                          }
                        }}
                        className="text-gray-400 hover:text-red-600 hidden group-hover:block px-1 z-30 cursor-pointer absolute right-1 bg-white rounded-full w-4 h-4 flex items-center justify-center shadow"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Empty message */}
              {dayPositioned.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs pointer-events-none">
                  ว่าง
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
