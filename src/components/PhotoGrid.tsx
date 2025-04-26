
import { useState } from "react";
import { Photo } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PhotoGridProps {
  photos: Photo[];
}

const PhotoGrid = ({ photos }: PhotoGridProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">В этом альбоме пока нет фотографий</p>
      </div>
    );
  }

  const calculateSpan = (index: number): string => {
    // Создаем коллажную сетку с разными размерами ячеек
    const patterns = [
      "col-span-1 row-span-1",
      "col-span-2 row-span-1",
      "col-span-1 row-span-2",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-2 row-span-2",
      "col-span-1 row-span-1",
      "col-span-2 row-span-1",
    ];
    
    return patterns[index % patterns.length];
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4 auto-rows-min">
        {photos.map((photo, index) => (
          <div 
            key={photo.id} 
            className={`${calculateSpan(index)} relative cursor-pointer overflow-hidden bg-gray-100 rounded-lg`}
            style={{ height: index % 3 === 0 ? '300px' : index % 5 === 0 ? '400px' : '200px' }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <img 
              src={photo.url} 
              alt={photo.name} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-white font-medium truncate">{photo.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedPhoto && (
            <div className="flex flex-col h-full">
              <div className="relative h-[80vh]">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-lg font-medium">{selectedPhoto.name}</h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGrid;
