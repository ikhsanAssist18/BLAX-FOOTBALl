export interface GalleryPhoto {
  name: string;
  date: string;
  time: string;
  venue: string;
  linkPhoto: string;
  linkVideo: string;
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
