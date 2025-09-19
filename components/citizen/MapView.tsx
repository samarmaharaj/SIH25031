
import React, { useState, useMemo } from 'react';
import { useReports } from '../../hooks/useMockReports';
import { Report } from '../../types';
import { MapPinIcon } from '../Icons';
import CitizenReportDetailModal from './CitizenReportDetailModal';

export const MapView: React.FC = () => {
    const { reports, loading } = useReports();
    const [activeReport, setActiveReport] = useState<Report | null>(null);
    const [modalReport, setModalReport] = useState<Report | null>(null);

    const reportsWithLocation = useMemo(() => reports.filter(r => r.location), [reports]);

    const mapBounds = useMemo(() => {
        if (reportsWithLocation.length === 0) return null;
        const latitudes = reportsWithLocation.map(r => r.location!.latitude);
        const longitudes = reportsWithLocation.map(r => r.location!.longitude);
        return {
            minLat: Math.min(...latitudes),
            maxLat: Math.max(...latitudes),
            minLng: Math.min(...longitudes),
            maxLng: Math.max(...longitudes),
        };
    }, [reportsWithLocation]);

    const getPosition = (report: Report) => {
        if (!mapBounds || !report.location) return { top: '50%', left: '50%' };
        
        const padding = 0.1; // 10% padding
        const latRange = mapBounds.maxLat - mapBounds.minLat;
        const lngRange = mapBounds.maxLng - mapBounds.minLng;
        
        const effectiveLatRange = latRange > 0.0001 ? latRange * (1 + 2 * padding) : 1;
        const effectiveLngRange = lngRange > 0.0001 ? lngRange * (1 + 2 * padding) : 1;

        const effectiveMinLat = mapBounds.minLat - (latRange * padding);
        const effectiveMinLng = mapBounds.minLng - (lngRange * padding);

        const top = 100 - (((report.location.latitude - effectiveMinLat) / effectiveLatRange) * 100);
        const left = ((report.location.longitude - effectiveMinLng) / effectiveLngRange) * 100;
        
        return { top: `${top}%`, left: `${left}%` };
    };

    const handleMarkerClick = (report: Report) => {
        setActiveReport(report);
    };

    if (loading) {
        return <p>Loading map...</p>;
    }
    
    return (
        <div className="relative w-full h-[calc(100vh-10rem)] bg-slate-100 rounded-lg shadow-inner overflow-hidden">
            {reportsWithLocation.map(report => {
                const position = getPosition(report);
                const isActive = activeReport?.id === report.id;
                return (
                    <div key={report.id} style={{ top: position.top, left: position.left, position: 'absolute' }} className="transform -translate-x-1/2 -translate-y-1/2">
                        <button onClick={() => handleMarkerClick(report)} className="transition-transform duration-200" style={{ transform: isActive ? 'scale(1.5)' : 'scale(1)' }}>
                            <MapPinIcon className={`h-8 w-8 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                        </button>
                    </div>
                );
            })}

            {activeReport && (
                <div style={{ top: getPosition(activeReport).top, left: getPosition(activeReport).left, position: 'absolute' }} className="transform -translate-x-1/2 -translate-y-full -mt-4 w-64">
                    <div className="bg-white rounded-lg shadow-lg p-3 z-10 relative animate-fade-in-up">
                        <button onClick={() => setActiveReport(null)} className="absolute top-1 right-1 text-slate-400">&times;</button>
                        <p className="text-sm font-semibold truncate mb-2">{activeReport.description || "View details"}</p>
                        <button onClick={() => { setModalReport(activeReport); setActiveReport(null); }} className="w-full bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-blue-600">
                            View Details
                        </button>
                    </div>
                </div>
            )}
            
            {modalReport && (
                <CitizenReportDetailModal 
                    report={modalReport}
                    onClose={() => setModalReport(null)}
                />
            )}
        </div>
    );
};
