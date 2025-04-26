
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
