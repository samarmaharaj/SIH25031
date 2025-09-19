import React from 'react';
import { HomeIcon, FireIcon, PlusCircleIcon, UserCircleIcon, MapIcon } from '../Icons';

type Tab = 'community' | 'trending' | 'report' | 'profile' | 'map';

interface BottomNavProps {
  activeTab: Tab;
  setTab: (tab: Tab) => void;
}

const NavItem: React.FC<{
  label: string;
  // FIX: Use React.ComponentType for the icon prop to correctly type function components.
  icon: React.ComponentType<{ className?: string; solid?: boolean }>;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full h-full text-sm font-medium transition-colors">
      <Icon className={`h-7 w-7 mb-1 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} solid={isActive} />
      <span className={isActive ? 'text-blue-600' : 'text-slate-600'}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 shadow-lg z-40 md:hidden">
      <div className="container mx-auto h-full max-w-4xl flex justify-around items-center">
        <NavItem label="Community" icon={HomeIcon} isActive={activeTab === 'community'} onClick={() => setTab('community')} />
        <NavItem label="Map" icon={MapIcon} isActive={activeTab === 'map'} onClick={() => setTab('map')} />
        <NavItem label="Report" icon={PlusCircleIcon} isActive={activeTab === 'report'} onClick={() => setTab('report')} />
        <NavItem label="Trending" icon={FireIcon} isActive={activeTab === 'trending'} onClick={() => setTab('trending')} />
        <NavItem label="Profile" icon={UserCircleIcon} isActive={activeTab === 'profile'} onClick={() => setTab('profile')} />
      </div>
    </nav>
  );
};

export default BottomNav;