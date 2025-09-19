
import React, { useMemo } from 'react';
import { useReports } from '../../hooks/useMockReports';
import ReportCard from '../ReportCard';
import { FireIcon } from '../Icons';

export const TrendingView: React.FC = () => {
    const { reports, loading } = useReports();

    const trendingReports = useMemo(() => {
        return [...reports].sort((a, b) => b.likes - a.likes);
    }, [reports]);

    if (loading) {
        return <p>Loading trending reports...</p>
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 mb-6">
                <FireIcon className="h-8 w-8 text-red-500" />
                <h2 className="text-3xl font-bold text-slate-800">Trending Reports</h2>
            </div>
            <div className="space-y-6">
                {trendingReports.map(report => (
                    <ReportCard key={report.id} report={report} />
                ))}
            </div>
        </div>
    );
};
