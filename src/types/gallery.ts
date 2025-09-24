export interface GalleryPhoto {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  venue: string;
  date: string;
  time: string;
  driveLink: string;
  tags: string[];
  uploadedBy: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  description?: string;
  photoCount: number;
}

export interface GallerySession {
  id: string;
  sessionName: string;
  date: string;
  time: string;
  driveLink: string;
  venue: string;
  category: string;
  photoCount: number;
  createdAt: string;
}