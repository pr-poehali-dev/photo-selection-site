
import { useState, useEffect } from "react";
import { getAlbums, addAlbum, updateAlbumName, deleteAlbum } from "@/lib/data";
import { Album } from "@/lib/types";
import Header from "@/components/Header";
import AlbumCard from "@/components/AlbumCard";
import CreateAlbumCard from "@/components/CreateAlbumCard";

const Index = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const loadAlbums = () => {
      const data = getAlbums();
      setAlbums(data);
    };

    loadAlbums();
  }, []);

  const handleCreateAlbum = (name: string) => {
    const newAlbum = addAlbum(name);
    setAlbums(prev => [...prev, newAlbum]);
  };

  const handleRenameAlbum = (id: string, newName: string) => {
    const updatedAlbum = updateAlbumName(id, newName);
    if (updatedAlbum) {
      setAlbums(prev => prev.map(album => 
        album.id === id ? updatedAlbum : album
      ));
    }
  };

  const handleDeleteAlbum = (id: string) => {
    const success = deleteAlbum(id);
    if (success) {
      setAlbums(prev => prev.filter(album => album.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-photo-primary">Мои альбомы</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map(album => (
            <AlbumCard 
              key={album.id} 
              album={album}
              onRename={handleRenameAlbum}
              onDelete={handleDeleteAlbum}
            />
          ))}
          
          {/* Create album card */}
          <div className="h-full">
            <CreateAlbumCard onCreateAlbum={handleCreateAlbum} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
