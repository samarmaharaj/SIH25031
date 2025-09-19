
import React, { useEffect } from 'react';
import { Report } from '../../types';
import { XMarkIcon, MapPinIcon, CalendarIcon, TagIcon } from '../Icons';

interface CitizenReportDetailModalProps {
  report: Report;
  onClose: () => void;
}

const CitizenReportDetailModal: React.FC<CitizenReportDetailModalProps> = ({ report, onClose }) => {
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Submitted': return 'bg-blue-100 text-blue-800';
        case 'Assigned': return 'bg-purple-100 text-purple-800';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800';
        case 'Resolved': return 'bg-green-100 text-green-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/2 bg-slate-100 flex items-center justify-center">
            <img src={firstImage?.data || 'https://via.placeholder.com/800x600.png?text=No+Image'} alt="Issue" className="w-full h-64 md:h-full object-contain"/>
        </div>
        <div className="md:w-1/2 p-6 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <img src={report.userPhotoUrl} alt={report.userName} className="h-12 w-12 rounded-full object-cover" />
              <div>
                  <h2 className="text-xl font-bold text-slate-800">{report.userName}</h2>
                  <p className="text-sm text-slate-500">Report ID: {report.id}</p>
              </div>
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
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold text-slate-800 flex items-center"><TagIcon className="h-4 w-4 mr-2"/>Category</h3>
                    <p>{report.category}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-slate-800">Status</h3>
                    <p>
                        <span className={`px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                        </span>
                    </p>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 flex items-center"><CalendarIcon className="h-4 w-4 mr-2"/>Submitted On</h3>
                    <p>{new Date(report.timestamp).toLocaleString()}</p>
                </div>
                {report.location &&
                  <div>
                      <h3 className="font-semibold text-slate-800 flex items-center"><MapPinIcon className="h-4 w-4 mr-2"/>Location</h3>
                      <a 
                          href={`https://www.google.com/maps?q=${report.location.latitude},${report.location.longitude}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                      >
                          View on Map
                      </a>
                  </div>
                }
            </div>
          </div>
          
          <div className="mt-auto pt-6 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 font-semibold">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenReportDetailModal;
