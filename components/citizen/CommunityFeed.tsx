
import React from 'react';
import { useReports } from '../../hooks/useMockReports';
import ReportCard from '../ReportCard';

export const CommunityFeed: React.FC = () => {
    const { reports, loading } = useReports();
    
    const sortedReports = [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (loading) {
        return <p>Loading reports...</p>
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {sortedReports.map(report => (
                <ReportCard key={report.id} report={report} />
            ))}
        </div>
    );
};
