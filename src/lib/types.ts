
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
  gapX: number;
  gapY: number;
  photoSize: 'small' | 'medium' | 'large';
  layout: 'grid' | 'masonry' | 'cards' | 'rows' | 'filmstrip';
  aspectRatio: 'original' | 'square' | 'portrait' | 'landscape';
  hover: 'zoom' | 'info' | 'none';
}
