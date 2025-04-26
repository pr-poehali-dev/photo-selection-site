
import { Album, Photo } from './types';

// Use localStorage to persist albums
const STORAGE_KEY = 'photo-app-albums';

// Initialize with empty albums if none exist
const initializeAlbums = (): Album[] => {
  const storedAlbums = localStorage.getItem(STORAGE_KEY);
  
  if (storedAlbums) {
    try {
      const parsed = JSON.parse(storedAlbums);
      // Parse dates that were stringified in JSON
      return parsed.map((album: any) => ({
        ...album,
        createdAt: new Date(album.createdAt),
        photos: album.photos.map((photo: any) => ({
          ...photo,
          createdAt: new Date(photo.createdAt)
        }))
      }));
    } catch (e) {
      console.error('Failed to parse stored albums:', e);
      return [];
    }
  }
  
  return [];
};

// Save albums to localStorage
const saveAlbums = (albums: Album[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
};

// Create a new album
const createAlbum = (name: string, photos: Photo[] = []): Album => {
  const id = `album-${Date.now()}`;
  return {
    id,
    name,
    photos,
    createdAt: new Date()
  };
};

// Create a new photo
const createPhoto = (name: string, url: string, albumId: string): Photo => {
  return {
    id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name,
    url,
    albumId,
    createdAt: new Date()
  };
};

// Get all albums
export const getAlbums = (): Album[] => {
  return initializeAlbums();
};

// Get album by ID
export const getAlbumById = (id: string): Album | undefined => {
  const albums = getAlbums();
  return albums.find(album => album.id === id);
};

// Add a new album
export const addAlbum = (name: string): Album => {
  const albums = getAlbums();
  const newAlbum = createAlbum(name);
  
  const updatedAlbums = [...albums, newAlbum];
  saveAlbums(updatedAlbums);
  
  return newAlbum;
};

// Update album name
export const updateAlbumName = (id: string, name: string): Album | undefined => {
  const albums = getAlbums();
  const albumIndex = albums.findIndex(album => album.id === id);
  
  if (albumIndex === -1) return undefined;
  
  const updatedAlbum = { ...albums[albumIndex], name };
  const updatedAlbums = [...albums];
  updatedAlbums[albumIndex] = updatedAlbum;
  
  saveAlbums(updatedAlbums);
  return updatedAlbum;
};

// Delete an album
export const deleteAlbum = (id: string): boolean => {
  const albums = getAlbums();
  const updatedAlbums = albums.filter(album => album.id !== id);
  
  saveAlbums(updatedAlbums);
  return updatedAlbums.length < albums.length;
};

// Add photo to album
export const addPhotoToAlbum = (albumId: string, name: string, url: string): Photo | undefined => {
  const albums = getAlbums();
  const albumIndex = albums.findIndex(album => album.id === albumId);
  
  if (albumIndex === -1) return undefined;
  
  const newPhoto = createPhoto(name, url, albumId);
  
  const updatedAlbum = { 
    ...albums[albumIndex],
    photos: [...albums[albumIndex].photos, newPhoto]
  };
  
  const updatedAlbums = [...albums];
  updatedAlbums[albumIndex] = updatedAlbum;
  
  saveAlbums(updatedAlbums);
  return newPhoto;
};

// Delete photos from album
export const deletePhotosFromAlbum = (albumId: string, photoIds: string[]): boolean => {
  const albums = getAlbums();
  const albumIndex = albums.findIndex(album => album.id === albumId);
  
  if (albumIndex === -1) return false;
  
  const updatedPhotos = albums[albumIndex].photos.filter(
    photo => !photoIds.includes(photo.id)
  );
  
  const updatedAlbum = { 
    ...albums[albumIndex],
    photos: updatedPhotos
  };
  
  const updatedAlbums = [...albums];
  updatedAlbums[albumIndex] = updatedAlbum;
  
  saveAlbums(updatedAlbums);
  return true;
};
