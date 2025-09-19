
export enum Status {
  Submitted = 'Submitted',
  InProgress = 'In Progress',
  Assigned = 'Assigned',
  Resolved = 'Resolved',
  Rejected = 'Rejected',
}

export enum Category {
  Pothole = 'Pothole',
  Graffiti = 'Graffiti',
  StreetlightOut = 'Streetlight Out',
  Trash = 'Trash & Recycling',
  TreeIssue = 'Tree Issue',
  Other = 'Other',
}

export enum Department {
  PublicWorks = 'Public Works',
  Transportation = 'Transportation',
  ParksAndRec = 'Parks and Recreation',
  Sanitation = 'Sanitation',
  Unassigned = 'Unassigned',
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: 'citizen' | 'staff';
}

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export interface Media {
    name: string;
    type: MediaType;
    data: string; // base64 encoded data
}

export interface Report {
  id: string;
  timestamp: string;
  media: Media[];
  location: {
    latitude: number;
    longitude: number;
  } | null; // Location can be optional
  description: string;
  status: Status;
  category: Category;
  department: Department;
  // New fields for social features
  userId: string;
  userName: string;
  userPhotoUrl: string;
  likes: number;
  likedBy: string[]; // array of user IDs who liked it
}

export interface Notification {
    id: string;
    userId: string;
    reportId: string;
    message: string;
    timestamp: string;
    read: boolean;
}
