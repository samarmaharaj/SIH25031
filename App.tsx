
import React, { useState } from 'react';
import CitizenView from './components/CitizenView';
import StaffView from './components/StaffView';
import Header from './components/Header';
import LoginView from './components/LoginView';
import { ReportProvider } from './hooks/useMockReports';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { BuildingOffice2Icon, UserIcon } from './components/Icons';

const PortalSelection: React.FC<{ onSelect: (role: 'citizen' | 'staff') => void }> = ({ onSelect }) => (
    <div className="flex flex-col items-center justify-center pt-16">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Welcome to CitizenConnect
            </h2>
            <p className="mt-2 text-lg text-gray-600">
                Please select your portal to continue.
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-8">
            <button
                onClick={() => onSelect('citizen')}
                className="group w-72 p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
                <UserIcon className="mx-auto h-16 w-16 text-blue-600 transition-colors group-hover:text-blue-700" />
                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                    Citizen Portal
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                    Report issues, track progress, and view community feedback.
                </p>
            </button>
            <button
                onClick={() => onSelect('staff')}
                className="group w-72 p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
                <BuildingOffice2Icon className="mx-auto h-16 w-16 text-blue-600 transition-colors group-hover:text-blue-700" />
                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                    Staff Portal
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                    Manage reports, update statuses, and assign departments.
                </p>
            </button>
        </div>
    </div>
);


const AppContent: React.FC = () => {
    const [selectedPortal, setSelectedPortal] = useState<'citizen' | 'staff' | null>(null);
    const { user, loading } = useAuth();

    const renderMainContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
        }

        if (user) {
            if (user.role === 'citizen') return <CitizenView />;
            if (user.role === 'staff') return <StaffView />;
        }

        if (selectedPortal) {
            return <LoginView role={selectedPortal} onBack={() => setSelectedPortal(null)} />;
        }

        return <PortalSelection onSelect={setSelectedPortal} />;
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
            <Header />
            <main className="p-4 sm:p-6 md:p-8 pb-24">
                {renderMainContent()}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ReportProvider>
                <AppContent />
            </ReportProvider>
        </AuthProvider>
    );
};

export default App;
