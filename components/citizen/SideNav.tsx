import React from 'react';
import { HomeIcon, MapIcon, FireIcon, UserCircleIcon, PlusIcon } from '../Icons';

type Tab = 'community' | 'trending' | 'report' | 'profile' | 'map';

interface SideNavProps {
  activeTab: Tab;
  setTab: (tab: Tab) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ComponentType<{ className?: string; solid?: boolean }>;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
      isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon className="h-6 w-6 mr-3" solid={isActive} />
    <span>{label}</span>
  </button>
);

const SideNav: React.FC<SideNavProps> = ({ activeTab, setTab }) => {
  return (
    <aside className="hidden md:block w-64 flex-shrink-0">
      <div className="bg-white p-4 rounded-lg shadow-md sticky top-8">
          <button
            onClick={() => setTab('report')}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 mb-6"
            aria-label="Create a new report"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Report</span>
          </button>
          <nav className="space-y-1">
            <NavItem label="Community" icon={HomeIcon} isActive={activeTab === 'community'} onClick={() => setTab('community')} />
            <NavItem label="Map" icon={MapIcon} isActive={activeTab === 'map'} onClick={() => setTab('map')} />
            <NavItem label="Trending" icon={FireIcon} isActive={activeTab === 'trending'} onClick={() => setTab('trending')} />
            <NavItem label="Profile" icon={UserCircleIcon} isActive={activeTab === 'profile'} onClick={() => setTab('profile')} />
          </nav>
      </div>
    </aside>
  );
};

export default SideNav;
