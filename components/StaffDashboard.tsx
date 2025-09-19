
import React, { useState, useMemo } from 'react';
import { useReports } from '../hooks/useMockReports';
import { useAuth } from '../hooks/useAuth';
import { Status, Category, Report } from '../types';
import { ALL_STATUSES, ALL_CATEGORIES } from '../constants';
import ReportDetailModal from './ReportDetailModal';

const StaffDashboard: React.FC = () => {
  const { reports } = useReports();
  const { user, logout } = useAuth();
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = useMemo(() => {
    return reports
      .filter(report => statusFilter === 'all' || report.status === statusFilter)
      .filter(report => categoryFilter === 'all' || report.category === categoryFilter)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [reports, statusFilter, categoryFilter]);
  
  const getStatusColor = (status: Status) => {
    switch (status) {
        case Status.Submitted: return 'border-blue-500';
        case Status.Assigned: return 'border-purple-500';
        case Status.InProgress: return 'border-yellow-500';
        case Status.Resolved: return 'border-green-500';
        case Status.Rejected: return 'border-red-500';
        default: return 'border-gray-500';
    }
  };

  return (
    <div className="container mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Staff Dashboard</h2>
            {user && <p className="text-slate-500">Welcome, {user.name}</p>}
          </div>
          <button
              onClick={logout}
              className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
          >
              Logout
          </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex-1">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">Filter by Category</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map(report => {
          const firstImage = report.media.find(m => m.type === 'image');
          return (
          <div 
            key={report.id}
            onClick={() => setSelectedReport(report)}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border-l-4 ${getStatusColor(report.status)}`}
          >
            <img src={firstImage?.data || 'https://via.placeholder.com/800x600.png?text=No+Image'} alt="Issue" className="w-full h-40 object-cover" />
            <div className="p-4">
              <p className="text-sm text-gray-500">{report.id} - {new Date(report.timestamp).toLocaleDateString()}</p>
              <p className="font-semibold mt-1 truncate">{report.description || 'No description provided.'}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{report.category}</span>
                <span className="text-sm font-semibold">{report.status}</span>
              </div>
            </div>
          </div>
        )})}
      </div>
      {filteredReports.length === 0 && (
        <div className="text-center py-16 col-span-full">
            <h3 className="text-xl font-semibold text-slate-700">No reports match the current filters.</h3>
        </div>
      )}

      {selectedReport && (
        <ReportDetailModal 
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

export default StaffDashboard;
