import React, { useState } from 'react';
import ReportForm from './ReportForm';
import { CommunityFeed } from './citizen/CommunityFeed';
import { TrendingView } from './citizen/TrendingView';
import { ProfileView } from './citizen/ProfileView';
import BottomNav from './citizen/BottomNav';
import { MapView } from './citizen/MapView';
import SideNav from './citizen/SideNav';

type CitizenViewMode = 'community' | 'trending' | 'report' | 'profile' | 'confirmation' | 'map';

interface ConfirmationDetails {
    id: string;
}

const CitizenView: React.FC = () => {
  const [view, setView] = useState<CitizenViewMode>('community');
  const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails | null>(null);

  const handleReportSubmitted = (reportId: string) => {
    setConfirmationDetails({ id: reportId });
    setView('confirmation');
  };

  const renderContent = () => {
    switch (view) {
      case 'community':
        return <CommunityFeed />;
      case 'trending':
        return <TrendingView />;
       case 'map':
        return <MapView />;
      case 'report':
        return <ReportForm onSubmitted={handleReportSubmitted} />;
      case 'profile':
        return <ProfileView />;
      case 'confirmation':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-green-600 mb-4">Report Submitted!</h2>
            <p className="text-slate-600 mb-6">Thank you for helping improve our community. Your report has been successfully submitted.</p>
            <div className="bg-slate-100 p-4 rounded-md">
                <p className="text-sm text-slate-500">Your Report ID is:</p>
                <p className="text-xl font-mono font-bold text-slate-800">{confirmationDetails?.id}</p>
            </div>
            <button
              onClick={() => setView('community')}
              className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Community Feed
            </button>
          </div>
        );
      default:
        return <CommunityFeed />;
    }
  };

  return (
    <div className="md:flex md:gap-8 max-w-6xl mx-auto">
      {view !== 'confirmation' && <SideNav activeTab={view} setTab={setView} />}
      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>
      {view !== 'confirmation' && <BottomNav activeTab={view} setTab={setView} />}
    </div>
  );
};

export default CitizenView;