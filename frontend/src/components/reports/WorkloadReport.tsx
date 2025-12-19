import { useState, useMemo } from 'react';
import { useAcadYear, useInstructors, useSubjects, useSessions, useRooms } from '../../hooks/useData';
import { DAYS, SLOTS } from '../../types';

export function WorkloadReport() {
  const { data: acadYear } = useAcadYear();
  const { data: instructors = [] } = useInstructors();
  const { data: subjects = [] } = useSubjects();
  const { data: sessions = [] } = useSessions();
  const { data: rooms = [] } = useRooms();
  const [filter, setFilter] = useState('ALL');

  // Get unique fields
  const fields = useMemo(() => {
    const fieldSet = new Set(instructors.map(i => i.field).filter(Boolean));
    return Array.from(fieldSet).sort();
  }, [instructors]);

  // Filter instructors
  const filteredInstructors = useMemo(() => {
    if (filter === 'ALL') return instructors;
    if (filter.startsWith('FIELD:')) {
      const field = filter.split(':')[1];
      return instructors.filter(i => i.field === field);
    }
    return instructors.filter(i => i.id === filter);
  }, [filter, instructors]);

  const isIndividual = !filter.startsWith('FIELD') && filter !== 'ALL';

  // Calculate workload for each instructor
  const getInstructorData = (instructor: any) => {
    // Get all subjects this instructor teaches
    const teaching = subjects.filter(s => {
      const subjectInstructors = Array.isArray(s.instructors) ? s.instructors : [];
      return subjectInstructors.some((i: any) => i.id === instructor.id);
    });

    let totalWorkload = 0;
    const subjectRows = teaching.map(subject => {
      const instructorData = (subject.instructors as any[]).find(i => i.id === instructor.id);
      const ratio = instructorData?.ratio || 100;
      const load = (subject.workload || subject.credit) * (ratio / 100);
      totalWorkload += load;

      return {
        subject,
        ratio,
        load
      };
    });

    return { teaching, subjectRows, totalWorkload };
  };

  // Get instructor's schedule
  const getInstructorSchedule = (instructorId: string) => {
    const schedule: Record<string, any[]> = {};

    DAYS.forEach(day => {
      const daySessions = sessions.filter(s => {
        if (s.day !== day || !s.start_slot) return false;
        const sub = subjects.find(subj => subj.id === s.subject_id);
        if (!sub) return false;
        const instructors = Array.isArray(sub.instructors) ? sub.instructors : [];
        return instructors.some((i: any) => i.id === instructorId);
      });

      schedule[day] = daySessions;
    });

    return schedule;
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-white">
      <div className="max-w-[280mm] mx-auto space-y-6">
        {/* Controls */}
        <div className="bg-gray-100 p-4 rounded border flex justify-between items-center no-print">
          <h3 className="font-bold text-gray-700">รายงานภาระงาน (Workload Report)</h3>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border p-2 rounded text-sm min-w-[200px]"
            >
              <option value="ALL">แสดงทั้งหมด</option>
              {fields.map(field => (
                <option key={field} value={`FIELD:${field}`}>
                  {field}
                </option>
              ))}
              <optgroup label="รายบุคคล">
                {instructors.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.prefix} {inst.first_name} {inst.last_name}
                  </option>
                ))}
              </optgroup>
            </select>
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
            สรุปภาระงานสอนอาจารย์ ภาคการศึกษา{' '}
            <span className="font-bold">{acadYear || '2/2568'}</span>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {filteredInstructors.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <i className="fas fa-inbox text-6xl mb-4 text-gray-300"></i>
              <h3 className="text-xl font-bold text-gray-500 mb-2">ไม่มีข้อมูลภาระงาน</h3>
              <p className="text-sm text-gray-400">
                กรุณาจัดตารางสอนในแท็บ "จัดตารางสอน" ก่อน
              </p>
            </div>
          ) : (
            filteredInstructors.map(instructor => {
              const { teaching, subjectRows, totalWorkload } = getInstructorData(instructor);

              // Skip if no subjects and showing all
              if (teaching.length === 0 && filter === 'ALL') return null;

              const schedule = isIndividual ? getInstructorSchedule(instructor.id) : null;

              return (
                <div
                  key={instructor.id}
                  className="bg-white rounded border overflow-hidden break-inside-avoid mb-6 p-4 shadow-sm"
                >
                  {/* Instructor Header */}
                  <div className="flex justify-between items-center mb-3 border-b pb-2">
                    <h4 className="font-bold text-lg text-gray-800">
                      {instructor.first_name} {instructor.last_name}{' '}
                      <span className="text-sm font-normal text-gray-500">
                        ({instructor.prefix})
                      </span>
                    </h4>
                    <span className="text-sm font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      รวมภาระงาน: {totalWorkload.toFixed(2)} ชม./สัปดาห์
                    </span>
                  </div>

                  {/* Subject Table */}
                  <table className="w-full text-sm mb-2 table-fixed">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="p-2 border text-left w-32">Code</th>
                        <th className="p-2 border text-left w-auto">Subject</th>
                        <th className="p-2 border text-center w-16">Credit</th>
                        <th className="p-2 border text-center w-20">Full Load</th>
                        <th className="p-2 border text-center w-20">Ratio</th>
                        <th className="p-2 border text-center w-20">Net Load</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectRows.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center p-2 text-gray-400">
                            No subjects assigned
                          </td>
                        </tr>
                      ) : (
                        subjectRows.map(({ subject, ratio, load }, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="p-2 border">
                              {subject.code} (Sec {subject.section})
                            </td>
                            <td className="p-2 border">{subject.name}</td>
                            <td className="p-2 border text-center">{subject.credit}</td>
                            <td className="p-2 border text-center text-gray-800">
                              {subject.workload || subject.credit}
                            </td>
                            <td className="p-2 border text-center">{ratio}%</td>
                            <td className="p-2 border text-center font-bold text-blue-600">
                              {load.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Weekly Schedule (only for individual view) */}
                  {schedule && (
                    <div className="mt-4">
                      <div className="border rounded text-xs">
                        {/* Header */}
                        <div className="grid grid-cols-[50px_repeat(14,1fr)] bg-gray-100 border-b font-bold text-center">
                          <div className="p-1">Day</div>
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
                              className="grid grid-cols-[50px_repeat(14,1fr)] border-b h-10 relative"
                            >
                              <div className="p-1 font-bold text-gray-500 text-center flex items-center justify-center bg-gray-50">
                                {day}
                              </div>
                              {SLOTS.map((_, i) => (
                                <div key={i} className="border-l"></div>
                              ))}

                              {/* Sessions */}
                              {daySessions.map((session) => {
                                const subject = subjects.find(s => s.id === session.subject_id);
                                if (!subject) return null;

                                const room = rooms.find(r => r.id === session.room_id);
                                const start = session.start_slot;
                                const width = session.duration;

                                return (
                                  <div
                                    key={session.id}
                                    className="absolute bg-blue-100 border-l-2 border-blue-600 text-[9px] p-1 overflow-hidden leading-tight"
                                    style={{
                                      left: `calc(50px + ${(start * 100) / 14}%)`,
                                      width: `calc(${(width * 100) / 14}%)`,
                                      top: '1px',
                                      bottom: '1px',
                                    }}
                                  >
                                    <div className="font-bold truncate text-[10px]">
                                      <span className="font-mono">
                                        {subject.code}-{subject.section}
                                      </span>{' '}
                                      {subject.name}
                                    </div>
                                    <div className="truncate text-[9px] text-gray-500">
                                      {room?.name || '?'}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
