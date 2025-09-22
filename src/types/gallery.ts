export interface GalleryPhoto {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  venue: string;
  date: string;
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