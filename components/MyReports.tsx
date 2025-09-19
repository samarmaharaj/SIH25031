
import React from 'react';
import { useReports } from '../hooks/useMockReports';
import { Status, Report } from '../types';
import { MapPinIcon, CalendarIcon, TagIcon } from './Icons';

// THIS COMPONENT IS NO LONGER USED. Its functionality has been moved to ProfileView.tsx

const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.Submitted:
      return 'bg-blue-100 text-blue-800';
    case Status.Assigned:
      return 'bg-purple-100 text-purple-800';
    case Status.InProgress:
      return 'bg-yellow-100 text-yellow-800';
    case Status.Resolved:
      return 'bg-green-100 text-green-800';
    case Status.Rejected:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ReportCard: React.FC<{ report: Report }> = ({ report }) => {
  const firstImage = report.media.find(m => m.type === 'image');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transform hover:scale-[1.02] transition-transform duration-300">
      <img src={firstImage?.data || 'https://via.placeholder.com/800x600.png?text=No+Image'} alt="Issue" className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-slate-500">ID: {report.id}</p>
            <span
              className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(report.status)}`}
            >
              {report.status}
            </span>
          </div>
          <p className="text-lg font-semibold text-slate-800 mb-3 break-words">{report.description}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          <div className="flex items-center space-x-1.5">
            <TagIcon className="h-4 w-4" />
            <span>{report.category}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(report.timestamp).toLocaleDateString()}</span>
          </div>
          {report.location &&
            <div className="flex items-center space-x-1.5">
                <MapPinIcon className="h-4 w-4" />
                <span>{report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}</span>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

const MyReports: React.FC = () => {
  const { reports } = useReports();

  const sortedReports = [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (reports.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-slate-700">No reports submitted yet.</h2>
        <p className="text-slate-500 mt-2">When you submit a report, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedReports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
};

export default MyReports;
