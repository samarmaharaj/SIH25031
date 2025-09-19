
import React from 'react';
import { Report } from '../types';
import { useReports } from '../hooks/useMockReports';
import { useAuth } from '../hooks/useAuth';
import { HeartIcon, MapPinIcon, CalendarIcon } from './Icons';

interface ReportCardProps {
  report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const { toggleLike } = useReports();
  const { user } = useAuth();
  const firstImage = report.media.find(m => m.type === 'image');
  
  const handleLike = () => {
    if (user) {
      toggleLike(report.id, user.id);
    }
  };
  
  const isLiked = user ? report.likedBy.includes(user.id) : false;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
      <div className="p-4 flex items-center space-x-3">
        <img src={report.userPhotoUrl} alt={report.userName} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-slate-800">{report.userName}</p>
          <p className="text-xs text-slate-500">{new Date(report.timestamp).toLocaleString()}</p>
        </div>
      </div>
      
      {firstImage && <img src={firstImage.data} alt="Issue" className="w-full h-72 object-cover" />}

      <div className="p-4">
        <div className="flex items-center space-x-4">
          <button onClick={handleLike} className="flex items-center space-x-1 text-slate-600 hover:text-red-500 transition-colors">
            <HeartIcon className={`h-7 w-7 ${isLiked ? 'text-red-500' : 'text-slate-500'}`} solid={isLiked} />
          </button>
        </div>
        <p className="font-semibold text-slate-700 mt-2">{report.likes} {report.likes === 1 ? 'like' : 'likes'}</p>
        
        {report.description &&
          <p className="mt-2 text-slate-800">
            <span className="font-semibold">{report.userName}</span> {report.description}
          </p>
        }
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
            <div className="flex items-center space-x-1">
                <span className="font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{report.category}</span>
            </div>
             <div className="flex items-center space-x-1">
                <span className={`font-medium px-2 py-0.5 rounded-full ${report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{report.status}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
