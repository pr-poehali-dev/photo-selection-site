
export interface Album {
  id: string;
  name: string;
  photos: Photo[];
  createdAt: Date;
}

export interface Photo {
  id: string;
  name: string;
  url: string;
  albumId: string;
  createdAt: Date;
}

export interface CollageSettings {
  gap: number;
  photoSize: 'small' | 'medium' | 'large';
  layout: 'grid' | 'masonry' | 'cards';
}
