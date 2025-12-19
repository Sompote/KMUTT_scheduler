import { useMemo } from 'react';
import { useRooms, useYears, useSessions, useSubjects, useSettings } from '../../hooks/useData';

interface RoomSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (roomId: string) => void;
  sessionId: string;
  day: string;
  startSlot: number;
  duration: number;
}

export function RoomSelectModal({
  isOpen,
  onClose,
  onSelect,
  sessionId,
  day,
  startSlot,
  duration
}: RoomSelectModalProps) {
  const { data: rooms = [] } = useRooms();
  const { data: years = [] } = useYears();
  const { data: sessions = [] } = useSessions();
  const { data: subjects = [] } = useSubjects();
  const { data: settings } = useSettings();

  const checkRoom = settings?.check_room_constraints ?? 1;

  // Calculate needed capacity
  const neededCapacity = useMemo(() => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return 0;

    const subject = subjects.find(s => s.id === session.subject_id);
    if (!subject) return 0;

    const subjectYears = Array.isArray(subject.year) ? subject.year : [subject.year];
    return subjectYears.reduce((sum, yId) => {
      const year = years.find(y => y.id === yId);
      return sum + (year?.count || 0);
    }, 0);
  }, [sessionId, sessions, subjects, years]);

  // Filter available rooms
  const availableRooms = useMemo(() => {
    return rooms.filter(room => {
      // If checkRoom is disabled, all rooms are available
      if (!checkRoom) return true;

      // Check capacity
      if (room.capacity < neededCapacity) return false;

      // Check if room is occupied during the time slot
      for (let i = 0; i < duration; i++) {
        const occupied = sessions.some(s => {
          if (s.id === sessionId) return false; // Skip the current session
          if (s.room_id !== room.id) return false; // Different room
          if (s.day !== day) return false; // Different day
          if (!s.start_slot) return false; // Not assigned

          const sStart = s.start_slot;
          const sEnd = sStart + s.duration;
          const checkSlot = startSlot + i;

          return checkSlot >= sStart && checkSlot < sEnd;
        });

        if (occupied) return false;
      }

      return true;
    });
  }, [rooms, sessions, sessionId, day, startSlot, duration, neededCapacity, checkRoom]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg z-50 p-6 relative">
        <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
          เลือกห้องเรียน
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({neededCapacity} ที่นั่ง)
          </span>
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {availableRooms.length === 0 ? (
            <div className="p-4 text-center text-red-500 font-bold">
              ไม่มีห้องว่าง
            </div>
          ) : (
            availableRooms.map(room => (
              <div
                key={room.id}
                onClick={() => onSelect(room.id)}
                className="p-3 bg-white border mb-2 rounded cursor-pointer hover:border-kmutt-orange hover:shadow-md transition group"
              >
                <div className="flex justify-between font-bold text-gray-700 group-hover:text-kmutt-orange">
                  <span>{room.name}</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                    Cap: {room.capacity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
