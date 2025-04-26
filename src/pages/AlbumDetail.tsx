
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAlbumById, addPhotoToAlbum } from "@/lib/data";
import { Album } from "@/lib/types";
import Header from "@/components/Header";
import PhotoGrid from "@/components/PhotoGrid";
import PhotoUpload from "@/components/PhotoUpload";
import { Button } from "@/components/ui/button";

const AlbumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    const loadAlbum = () => {
      const albumData = getAlbumById(id);
      if (albumData) {
        setAlbum(albumData);
      }
      setLoading(false);
    };
    
    loadAlbum();
  }, [id]);
  
  const handlePhotoUploaded = () => {
    if (!id) return;
    // Reload album data after new photos are uploaded
    const updatedAlbum = getAlbumById(id);
    if (updatedAlbum) {
      setAlbum(updatedAlbum);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p>Загрузка...</p>
          </div>
        </main>
      </div>
    );
  }
  
  if (!album) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Альбом не найден</h2>
            <Link to="/">
              <Button>Вернуться на главную</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-photo-primary hover:text-photo-accent mr-4">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-photo-primary">{album.name}</h1>
          </div>
          <p className="text-photo-muted">{album.photos.length} фото</p>
        </div>
        
        <PhotoUpload albumId={album.id} onPhotoUploaded={handlePhotoUploaded} />
        
        <div className="mt-8">
          <PhotoGrid photos={album.photos} />
        </div>
      </main>
    </div>
  );
};

export default AlbumDetail;
