
import React, { useState, useRef } from 'react';
import { useReports } from '../hooks/useMockReports';
import { useAuth } from '../hooks/useAuth';
import { Category, Department, Status, Report, Media, MediaType } from '../types';
import { categorizeIssue } from '../services/geminiService';
import { CameraIcon, MapPinIcon, VideoCameraIcon, MicrophoneIcon, DocumentIcon, XMarkIcon } from './Icons';
import Spinner from './Spinner';

interface ReportFormProps {
  onSubmitted: (reportId: string) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmitted }) => {
  const { addReport } = useReports();
  const { user } = useAuth();
  const [media, setMedia] = useState<Media[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; } | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = (type: MediaType) => {
    if (fileInputRef.current) {
      let accept = '';
      let capture: boolean | 'user' | 'environment' = false;
      switch (type) {
        case 'image':
          accept = 'image/*';
          capture = 'environment';
          break;
        case 'video':
          accept = 'video/*';
          capture = 'environment';
          break;
        case 'audio':
          accept = 'audio/*';
          capture = true;
          break;
        case 'document':
          accept = '.pdf,.doc,.docx,.txt';
          break;
      }
      fileInputRef.current.accept = accept;
      if (capture) {
        fileInputRef.current.capture = String(capture);
      } else {
        fileInputRef.current.removeAttribute('capture');
      }
      fileInputRef.current.dataset.mediaType = type;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const mediaType = event.target.dataset.mediaType as MediaType;
    if (files && mediaType) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          setMedia(prev => [...prev, {
            name: file.name,
            type: mediaType,
            data: reader.result as string,
          }]);
        };
        reader.readAsDataURL(file);
      }
    }
    // Reset file input value to allow selecting the same file again
    event.target.value = '';
  };
  
  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const getLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (position) => setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      () => setError('Could not retrieve location. Please enable location services.')
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!description && media.length === 0) {
      setError('Please provide a description or attach a media file.');
      return;
    }
    if (!user) {
      setError('You must be logged in to submit a report.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const category = description ? await categorizeIssue(description) : Category.Other;

      const newReport: Report = {
        id: `CIT-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        media,
        location,
        description,
        status: Status.Submitted,
        category,
        department: Department.Unassigned,
        userId: user.id,
        userName: user.name,
        userPhotoUrl: user.photoUrl,
        likes: 0,
        likedBy: [],
      };

      await addReport(newReport);
      onSubmitted(newReport.id);
    } catch (e) {
      console.error(e);
      setError('Failed to submit report. The AI categorization might have failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isSubmittable = (description || media.length > 0) && !isSubmitting;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Report a New Issue</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

        <div>
          <label htmlFor="description" className="block text-lg font-semibold text-slate-700 mb-2">1. Describe the Issue</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 'Large pothole on Main St.' (Optional if media is attached)"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-700 mb-2">2. Attach Media (Optional)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <MediaButton icon={CameraIcon} label="Photo" onClick={() => triggerFileInput('image')} />
              <MediaButton icon={VideoCameraIcon} label="Video" onClick={() => triggerFileInput('video')} />
              <MediaButton icon={MicrophoneIcon} label="Audio" onClick={() => triggerFileInput('audio')} />
              <MediaButton icon={DocumentIcon} label="Document" onClick={() => triggerFileInput('document')} />
          </div>
          {media.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {media.map((file, index) => (
                <div key={index} className="relative group bg-slate-100 rounded-lg overflow-hidden aspect-square">
                  {file.type === 'image' && <img src={file.data} className="w-full h-full object-cover" alt="preview"/>}
                  {file.type === 'video' && <video src={file.data} className="w-full h-full object-cover" />}
                  {file.type === 'audio' && <div className="p-2 flex flex-col items-center justify-center h-full"><MicrophoneIcon className="w-8 h-8 text-slate-500"/><p className="text-xs text-center break-all mt-1">{file.name}</p></div>}
                  {file.type === 'document' && <div className="p-2 flex flex-col items-center justify-center h-full"><DocumentIcon className="w-8 h-8 text-slate-500"/><p className="text-xs text-center break-all mt-1">{file.name}</p></div>}
                  <button onClick={() => removeMedia(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-700 mb-2">3. Tag Location (Optional)</label>
          <button type="button" onClick={getLocation} className={`w-full p-4 border-2 rounded-lg flex items-center justify-center space-x-3 transition-colors ${location ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-blue-500'}`}>
            <MapPinIcon className={`h-6 w-6 ${location ? 'text-green-600' : 'text-slate-500'}`} />
            <span className={`font-semibold ${location ? 'text-green-700' : 'text-slate-600'}`}>{location ? `Location Acquired: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Get Current Location'}</span>
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button type="submit" disabled={!isSubmittable} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center">
          {isSubmitting ? <Spinner /> : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

const MediaButton: React.FC<{icon: React.ComponentType<{className?: string}>, label: string, onClick: () => void}> = ({ icon: Icon, label, onClick }) => (
    <button type="button" onClick={onClick} className="w-full p-3 border border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
        <Icon className="h-8 w-8 mb-1" />
        <span className="text-sm font-semibold">{label}</span>
    </button>
);

export default ReportForm;
