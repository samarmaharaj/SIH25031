
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useReports } from '../../hooks/useMockReports';
import ReportCard from '../ReportCard';
import { BellIcon, XMarkIcon } from '../Icons';

export const ProfileView: React.FC = () => {
    const { user, logout } = useAuth();
    const { reports, notifications } = useReports();
    const [showNotifications, setShowNotifications] = useState(false);

    const myReports = useMemo(() => {
        return reports
            .filter(report => report.userId === user?.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [reports, user]);

    const userNotifications = useMemo(() => {
        return notifications.filter(n => n.userId === user?.id);
    }, [notifications, user]);

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img src={user.photoUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                            <p className="text-slate-500">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setShowNotifications(true)} className="relative text-slate-600 hover:text-blue-600">
                            <BellIcon className="h-7 w-7" />
                            {userNotifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{userNotifications.length}</span>
                                </span>
                            )}
                        </button>
                        <button
                            onClick={logout}
                            className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-4">My Reports</h3>
            {myReports.length > 0 ? (
                <div className="space-y-6">
                    {myReports.map(report => (
                        <ReportCard key={report.id} report={report} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-md">
                    <p className="text-slate-600">You haven't submitted any reports yet.</p>
                </div>
            )}
            
            {showNotifications && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            <button onClick={() => setShowNotifications(false)}><XMarkIcon className="h-6 w-6" /></button>
                        </div>
                        <div className="overflow-y-auto">
                            {userNotifications.length > 0 ? (
                                <ul>
                                    {userNotifications.map(n => (
                                        <li key={n.id} className="p-4 border-b hover:bg-slate-50">
                                            <p className="text-sm text-slate-700">{n.message}</p>
                                            <p className="text-xs text-slate-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="p-8 text-center text-slate-500">No new notifications.</p>
                            )}
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};
