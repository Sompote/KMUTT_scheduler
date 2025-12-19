import { useState } from 'react';
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } from '../../hooks/useData';
import { Modal } from '../common/Modal';
import type { Room } from '../../types';

interface RoomFormData {
  id: string;
  name: string;
  capacity: number;
}

export function RoomsList() {
  const { data: rooms = [], isLoading } = useRooms();
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<RoomFormData>({
    id: '',
    name: '',
    capacity: 40,
  });

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setFormData({
      id: '',
      name: '',
      capacity: 40,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingRoom) {
        await updateRoom.mutateAsync({ id: editingRoom.id, data: formData });
      } else {
        await createRoom.mutateAsync(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('ยืนยันลบห้องนี้?')) {
      try {
        await deleteRoom.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 flex flex-col h-1/3 min-h-[250px]">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h3 className="font-bold text-green-800 text-sm md:text-base">
          <i className="fas fa-door-open mr-2"></i> ห้องเรียน (Rooms)
        </h3>
        <button
          onClick={handleAdd}
          className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 font-bold"
        >
          + เพิ่ม
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll space-y-1 pr-1">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleEdit(room)}
            className="flex justify-between items-center p-2 hover:bg-gray-50 border-b border-gray-100 last:border-0 group cursor-pointer"
          >
            <div className="truncate pr-2 w-full text-sm text-gray-700">
              <b>{room.id}</b> : {room.name}{' '}
              <span className="text-xs text-gray-400 font-light">(ความจุ {room.capacity} ที่นั่ง)</span>
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
        title={editingRoom ? 'แก้ไขห้องเรียน' : 'เพิ่มห้องเรียน'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                ID / Code
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                placeholder="CB1103"
                required
                disabled={!!editingRoom}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                ชื่อ (Name)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                placeholder="CB1103"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                ความจุ (Capacity)
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-kmutt-orange"
                min="1"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-2">
            {editingRoom && (
              <button
                type="button"
                onClick={() => handleDelete(editingRoom.id)}
                className="text-red-500 text-sm font-bold hover:underline"
              >
                ลบห้อง
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
                className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 shadow-sm"
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
