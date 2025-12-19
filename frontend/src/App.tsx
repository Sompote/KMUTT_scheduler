import { useState } from 'react'
import { DataManagement } from './components/data/DataManagement'
import { SchedulerTab } from './components/scheduler/SchedulerTab'
import { WorkloadReport } from './components/reports/WorkloadReport'
import { RoomReport } from './components/reports/RoomReport'
import { Toast } from './components/common/Toast'

function App() {
  const [activeTab, setActiveTab] = useState<'setup' | 'scheduler' | 'report' | 'roomreport'>('setup')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  })

  return (
    <div className="flex flex-col h-screen text-gray-800">
      {/* Navigation */}
      <nav className="bg-gray-900 text-gray-300 shadow-lg z-50 flex-shrink-0">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-kmutt-orange rounded-full flex items-center justify-center font-bold text-white text-xl shadow-md border-2 border-white">
                K
              </div>
              <div>
                <div className="text-lg font-bold text-white tracking-wide leading-none">
                  CE KMUTT Scheduler
                </div>
                <div className="text-[10px] text-yellow-400 font-normal">
                  ภาควิชาวิศวกรรมโยธา คณะวิศวกรรมศาสตร์
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('setup')}
                className={`nav-btn px-4 py-2 rounded text-sm transition ${
                  activeTab === 'setup'
                    ? 'bg-kmutt-orange text-white font-bold shadow'
                    : 'hover:bg-gray-800'
                }`}
              >
                <i className="fas fa-database mr-2"></i>ข้อมูลพื้นฐาน
              </button>
              <button
                onClick={() => setActiveTab('scheduler')}
                className={`nav-btn px-4 py-2 rounded text-sm transition ${
                  activeTab === 'scheduler'
                    ? 'bg-kmutt-orange text-white font-bold shadow'
                    : 'hover:bg-gray-800'
                }`}
              >
                <i className="fas fa-calendar-alt mr-2"></i>จัดตารางสอน
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`nav-btn px-4 py-2 rounded text-sm transition ${
                  activeTab === 'report'
                    ? 'bg-kmutt-orange text-white font-bold shadow'
                    : 'hover:bg-gray-800'
                }`}
              >
                <i className="fas fa-file-alt mr-2"></i>รายงาน
              </button>
              <button
                onClick={() => setActiveTab('roomreport')}
                className={`nav-btn px-4 py-2 rounded text-sm transition ${
                  activeTab === 'roomreport'
                    ? 'bg-kmutt-orange text-white font-bold shadow'
                    : 'hover:bg-gray-800'
                }`}
              >
                <i className="fas fa-door-open mr-2"></i>การใช้ห้อง
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative bg-gray-100 w-full">
        {activeTab === 'setup' && <DataManagement />}
        {activeTab === 'scheduler' && <SchedulerTab />}
        {activeTab === 'report' && <WorkloadReport />}
        {activeTab === 'roomreport' && <RoomReport />}

        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast({ ...toast, isVisible: false })}
        />
      </main>
    </div>
  )
}

export default App
