
import React, { useState, useEffect } from 'react';
import { Report, Status, Department } from '../types';
import { useReports } from '../hooks/useMockReports';
import { ALL_STATUSES, ALL_DEPARTMENTS } from '../constants';
import { XMarkIcon } from './Icons';

interface ReportDetailModalProps {
  report: Report;
  onClose: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose }) => {
  const { updateReport } = useReports();
  const [status, setStatus] = useState<Status>(report.status);
  const [department, setDepartment] = useState<Department>(report.department);
  const [isSaving, setIsSaving] = useState(false);
  const firstImage = report.media.find(m => m.type === 'image');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateReport(report.id, { status, department });
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/2 bg-slate-100 flex items-center justify-center">
            <img src={firstImage?.data || 'https://via.placeholder.com/800x600.png?text=No+Image'} alt="Issue" className="w-full h-64 md:h-full object-contain"/>
        </div>
        <div className="md:w-1/2 p-6 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Report Details</h2>
                <p className="text-sm font-mono text-slate-500">{report.id}</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="h-7 w-7"/>
            </button>
          </div>

          <div className="space-y-4 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-800">Description</h3>
              <p className="bg-slate-50 p-3 rounded-md">{report.description || 'No description provided.'}</p>
            </div>
             <div>
              <h3 className="font-semibold text-slate-800">Category</h3>
              <p>{report.category}</p>
            </div>
            {report.location && (
              <div>
                <h3 className="font-semibold text-slate-800">Location</h3>
                <a 
                  href={`https://www.google.com/maps?q=${report.location.latitude},${report.location.longitude}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {report.location.latitude.toFixed(5)}, {report.location.longitude.toFixed(5)}
                </a>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-slate-800">Submitted On</h3>
              <p>{new Date(report.timestamp).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="border-t my-6"></div>

          <div className="space-y-4">
             <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Assign Department</label>
                <select
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                    <option value={Department.Unassigned}>Unassigned</option>
                    {ALL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Update Status</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
          </div>
          
          <div className="mt-auto pt-6 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 font-semibold">Cancel</button>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold disabled:bg-slate-400"
            >
                {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
