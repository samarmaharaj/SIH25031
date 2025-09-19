
// Fix: Import the full 'React' module to use React.createElement, which is necessary to avoid JSX in a .ts file.
import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { Report, Status, Category, Department, Notification } from '../types';

interface ReportContextType {
  reports: Report[];
  notifications: Notification[];
  addReport: (report: Report) => Promise<void>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  toggleLike: (reportId: string, userId: string) => Promise<void>;
  loading: boolean;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const initialReports: Report[] = [
    {
        id: 'CIT-168901',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        media: [{ name: 'pothole.jpg', type: 'image', data: 'https://picsum.photos/seed/pothole/800/600' }],
        location: { latitude: 34.0522, longitude: -118.2437 },
        description: 'Deep pothole on the corner of Elm Street in Los Angeles, hazardous for cyclists.',
        status: Status.Resolved,
        category: Category.Pothole,
        department: Department.PublicWorks,
        userId: 'user-g12345',
        userName: 'Alex Doe',
        userPhotoUrl: 'https://i.pravatar.cc/150?u=alexdoe',
        likes: 128,
        likedBy: [],
    },
    {
        id: 'CIT-453321',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        media: [{ name: 'graffiti.jpg', type: 'image', data: 'https://picsum.photos/seed/graffiti/800/600' }],
        location: { latitude: 40.7128, longitude: -74.0060 },
        description: 'Graffiti on the wall of the public library in New York City, needs to be cleaned up.',
        status: Status.Assigned,
        category: Category.Graffiti,
        department: Department.ParksAndRec,
        userId: 'user-miketaylor',
        userName: 'Mike Taylor',
        userPhotoUrl: 'https://i.pravatar.cc/150?u=miketaylor',
        likes: 75,
        likedBy: [],
    },
    {
        id: 'CIT-987123',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        media: [{ name: 'streetlight.jpg', type: 'image', data: 'https://picsum.photos/seed/streetlight/800/600' }],
        location: { latitude: 28.6139, longitude: 77.2090 },
        description: 'Streetlight in Connaught Place, Delhi is flickering and seems to be out. Very dark at night.',
        status: Status.Submitted,
        category: Category.StreetlightOut,
        department: Department.Unassigned,
        userId: 'user-priyasingh',
        userName: 'Priya Singh',
        userPhotoUrl: 'https://i.pravatar.cc/150?u=priyasingh',
        likes: 210,
        likedBy: [],
    },
    {
        id: 'CIT-543210',
        timestamp: new Date().toISOString(),
        media: [{ name: 'trash.jpg', type: 'image', data: 'https://picsum.photos/seed/trash/800/600' }],
        location: { latitude: 19.0760, longitude: 72.8777 },
        description: 'Overflowing trash can at Juhu Beach, Mumbai. Requires immediate attention.',
        status: Status.InProgress,
        category: Category.Trash,
        department: Department.Sanitation,
        userId: 'user-arjunreddy',
        userName: 'Arjun Reddy',
        userPhotoUrl: 'https://i.pravatar.cc/150?u=arjunreddy',
        likes: 34,
        likedBy: [],
    }
];


export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedReports = localStorage.getItem('citizen-reports');
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      } else {
        setReports(initialReports);
        localStorage.setItem('citizen-reports', JSON.stringify(initialReports));
      }
      const storedNotifications = localStorage.getItem('citizen-notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setReports(initialReports);
    } finally {
        setLoading(false);
    }
  }, []);

  const saveReports = (newReports: Report[]) => {
    localStorage.setItem('citizen-reports', JSON.stringify(newReports));
    setReports(newReports);
  };
  
  const saveNotifications = (newNotifications: Notification[]) => {
    localStorage.setItem('citizen-notifications', JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  };

  const addNotification = (report: Report, newStatus: Status) => {
    const descriptionSnippet = report.description ? `"${report.description.substring(0, 20)}..."` : `(ID: ${report.id})`;
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      userId: report.userId,
      reportId: report.id,
      message: `The status of your report ${descriptionSnippet} has been updated to ${newStatus}. An email/SMS notification has also been sent.`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => {
        const updated = [newNotification, ...prev];
        saveNotifications(updated);
        return updated;
    });
  };

  const addReport = useCallback(async (report: Report): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => { // Simulate network delay
            setReports(prevReports => {
                const newReports = [report, ...prevReports];
                saveReports(newReports);
                return newReports;
            });
            resolve();
        }, 500);
    });
  }, []);


  const updateReport = useCallback(async (id: string, updates: Partial<Report>): Promise<void> => {
     return new Promise(resolve => {
        setTimeout(() => { // Simulate network delay
            setReports(prevReports => {
                const reportToUpdate = prevReports.find(r => r.id === id);
                const newReports = prevReports.map(r => r.id === id ? { ...r, ...updates } : r);
                saveReports(newReports);
                if (reportToUpdate && updates.status && reportToUpdate.status !== updates.status) {
                    addNotification(reportToUpdate, updates.status);
                }
                return newReports;
            });
            resolve();
        }, 300);
     });
  }, []);
  
  const toggleLike = useCallback(async (reportId: string, userId: string): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        setReports(prevReports => {
          const newReports = prevReports.map(r => {
            if (r.id === reportId) {
              const liked = r.likedBy.includes(userId);
              if (liked) {
                return { ...r, likes: r.likes - 1, likedBy: r.likedBy.filter(id => id !== userId) };
              } else {
                return { ...r, likes: r.likes + 1, likedBy: [...r.likedBy, userId] };
              }
            }
            return r;
          });
          saveReports(newReports);
          return newReports;
        });
        resolve();
      }, 100);
    });
  }, []);

  return React.createElement(ReportContext.Provider, { value: { reports, notifications, addReport, updateReport, toggleLike, loading } }, children);
};

export const useReports = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
