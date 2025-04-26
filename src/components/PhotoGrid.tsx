
import { useState } from "react";
import { Photo } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CollageSettings } from "@/lib/types";
import { LayoutGrid, Layers, Square, Rows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface PhotoGridProps {
  photos: Photo[];
}

const PhotoGrid = ({ photos }: PhotoGridProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [settings, setSettings] = useState<CollageSettings>({
    gap: 8,
    photoSize: 'medium',
    layout: 'masonry'
  });

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">В этом альбоме пока нет фотографий</p>
      </div>
    );
  }

  const getGapClass = () => {
    const gaps = {
      0: 'gap-0',
      4: 'gap-1',
      8: 'gap-2',
      12: 'gap-3',
      16: 'gap-4',
      20: 'gap-5',
      24: 'gap-6',
    };
    return gaps[settings.gap as keyof typeof gaps] || 'gap-2';
  };

  const getPhotoSizeClasses = () => {
    switch (settings.photoSize) {
      case 'small':
        return 'h-40 sm:h-48';
      case 'large':
        return 'h-64 sm:h-80';
      default:
        return 'h-52 sm:h-64';
    }
  };

  const renderMasonryLayout = () => (
    <div className={`columns-2 sm:columns-3 md:columns-4 ${getGapClass()}`}>
      {photos.map((photo) => (
        <div 
          key={photo.id}
          className="break-inside-avoid mb-4 group relative cursor-pointer"
          onClick={() => setSelectedPhoto(photo)}
        >
          <img 
            src={photo.url} 
            alt={photo.name} 
            className="w-full rounded-lg object-cover transition-transform hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-white font-medium truncate">{photo.name}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGridLayout = () => (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${getGapClass()}`}>
      {photos.map((photo) => (
        <div 
          key={photo.id}
          className={`relative cursor-pointer overflow-hidden bg-gray-100 rounded-lg ${getPhotoSizeClasses()}`}
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
  );

  const renderCardsLayout = () => (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${getGapClass()}`}>
      {photos.map((photo) => (
        <div 
          key={photo.id}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedPhoto(photo)}
        >
          <div className={`w-full ${getPhotoSizeClasses()} overflow-hidden`}>
            <img 
              src={photo.url} 
              alt={photo.name} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="p-3">
            <h3 className="font-medium truncate">{photo.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLayout = () => {
    switch (settings.layout) {
      case 'grid':
        return renderGridLayout();
      case 'cards':
        return renderCardsLayout();
      default:
        return renderMasonryLayout();
    }
  };

  return (
    <>
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium mb-2">Настройки отображения</h2>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant={settings.layout === 'masonry' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, layout: 'masonry' }))}
              >
                <Layers className="w-4 h-4 mr-1" />
                Мозаика
              </Button>
              <Button 
                size="sm" 
                variant={settings.layout === 'grid' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, layout: 'grid' }))}
              >
                <LayoutGrid className="w-4 h-4 mr-1" />
                Сетка
              </Button>
              <Button 
                size="sm" 
                variant={settings.layout === 'cards' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, layout: 'cards' }))}
              >
                <Square className="w-4 h-4 mr-1" />
                Карточки
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="w-full sm:w-32">
              <p className="text-sm mb-1">Размер фото</p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant={settings.photoSize === 'small' ? 'default' : 'outline'}
                  onClick={() => setSettings(prev => ({ ...prev, photoSize: 'small' }))}
                  className="flex-1"
                >
                  S
                </Button>
                <Button 
                  size="sm" 
                  variant={settings.photoSize === 'medium' ? 'default' : 'outline'}
                  onClick={() => setSettings(prev => ({ ...prev, photoSize: 'medium' }))}
                  className="flex-1"
                >
                  M
                </Button>
                <Button 
                  size="sm" 
                  variant={settings.photoSize === 'large' ? 'default' : 'outline'}
                  onClick={() => setSettings(prev => ({ ...prev, photoSize: 'large' }))}
                  className="flex-1"
                >
                  L
                </Button>
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <p className="text-sm mb-1">Отступы: {settings.gap}px</p>
              <Slider
                value={[settings.gap]}
                min={0}
                max={24}
                step={4}
                onValueChange={(value) => setSettings(prev => ({ ...prev, gap: value[0] }))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {renderLayout()}
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
