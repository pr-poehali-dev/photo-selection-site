
import { useState, useEffect } from "react";
import { Photo, Album } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  LayoutGrid, 
  Layers, 
  Square, 
  Rows, 
  Film,
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Move, 
  Maximize,
  Minimize,
  MinusSquare,
  PlusSquare,
  Trash,
  Settings2,
  MoveHorizontal,
  MoveVertical,
  Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { deletePhotosFromAlbum, getAlbums } from "@/lib/data";
import { CollageSettings } from "@/lib/types";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

interface PhotoGridProps {
  photos: Photo[];
  albumId: string;
  onPhotosDeleted: () => void;
  onPhotoMoved?: (photoId: string, destinationAlbumId: string) => void;
}

const PhotoGrid = ({ photos, albumId, onPhotosDeleted, onPhotoMoved }: PhotoGridProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [hoverPhotoId, setHoverPhotoId] = useState<string | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [moveToAlbumId, setMoveToAlbumId] = useState<string>("");
  const [settings, setSettings] = useState<CollageSettings>({
    gapX: 8,
    gapY: 8,
    photoSize: 'medium',
    layout: 'masonry',
    aspectRatio: 'original',
    hover: 'zoom'
  });

  useEffect(() => {
    // Load available albums for move operation
    const loadedAlbums = getAlbums().filter(album => album.id !== albumId);
    setAlbums(loadedAlbums);
    if (loadedAlbums.length > 0 && !moveToAlbumId) {
      setMoveToAlbumId(loadedAlbums[0].id);
    }
  }, [albumId]);

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50">
        <p className="text-gray-500">В этом альбоме пока нет фотографий</p>
      </div>
    );
  }

  const getGapStyle = () => {
    return {
      gap: `${settings.gapY}px ${settings.gapX}px`
    };
  };

  const getPhotoSizeClasses = () => {
    switch (settings.photoSize) {
      case 'small':
        return 'h-32 sm:h-40';
      case 'large':
        return 'h-72 sm:h-96';
      default:
        return 'h-52 sm:h-64';
    }
  };

  const getAspectRatioClass = () => {
    switch (settings.aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-[3/4]';
      case 'landscape':
        return 'aspect-[4/3]';
      default:
        return '';
    }
  };

  const handlePhotoClick = (photo: Photo, index: number) => {
    if (isSelectionMode) {
      togglePhotoSelection(photo.id);
    } else {
      setSelectedPhoto(photo);
      setSelectedPhotoIndex(index);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotoIds(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(prev => !prev);
    if (isSelectionMode) {
      setSelectedPhotoIds([]); // Clear selections when exiting selection mode
    }
  };

  const deleteSelectedPhotos = () => {
    if (selectedPhotoIds.length === 0) return;
    
    deletePhotosFromAlbum(albumId, selectedPhotoIds);
    setSelectedPhotoIds([]);
    setIsSelectionMode(false);
    onPhotosDeleted();
  };

  const deleteAllPhotos = () => {
    const allPhotoIds = photos.map(photo => photo.id);
    deletePhotosFromAlbum(albumId, allPhotoIds);
    setSelectedPhotoIds([]);
    setIsSelectionMode(false);
    onPhotosDeleted();
  };

  const deletePhoto = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deletePhotosFromAlbum(albumId, [photoId]);
    onPhotosDeleted();
  };

  const movePhoto = (photoId: string, targetAlbumId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPhotoMoved) {
      onPhotoMoved(photoId, targetAlbumId);
    }
  };

  const moveSelectedPhotos = () => {
    if (selectedPhotoIds.length === 0 || !moveToAlbumId) return;
    
    selectedPhotoIds.forEach(photoId => {
      if (onPhotoMoved) {
        onPhotoMoved(photoId, moveToAlbumId);
      }
    });
    
    setSelectedPhotoIds([]);
    setIsSelectionMode(false);
  };

  const renderMasonryLayout = () => (
    <div 
      className="columns-2 sm:columns-3 md:columns-4" 
      style={getGapStyle()}
    >
      {photos.map((photo, index) => (
        <div 
          key={photo.id}
          className="break-inside-avoid mb-4 group relative cursor-pointer"
          onClick={() => handlePhotoClick(photo, index)}
          onMouseEnter={() => setHoverPhotoId(photo.id)}
          onMouseLeave={() => setHoverPhotoId(null)}
        >
          {isSelectionMode && (
            <div className="absolute top-2 left-2 z-10">
              <Checkbox 
                checked={selectedPhotoIds.includes(photo.id)}
                onCheckedChange={() => togglePhotoSelection(photo.id)}
                className="h-5 w-5 bg-white/80"
              />
            </div>
          )}
          <img 
            src={photo.url} 
            alt={photo.name} 
            className={`w-full object-cover transition-transform ${settings.hover === 'zoom' ? 'group-hover:scale-[1.02]' : ''} ${getAspectRatioClass()}`}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-white font-medium truncate">{photo.name}</p>
          </div>
          
          {/* Hover Actions */}
          {hoverPhotoId === photo.id && !isSelectionMode && (
            <div className="absolute top-2 right-2 flex space-x-1">
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-8 w-8 bg-black/20 hover:bg-black/40"
                onClick={(e) => deletePhoto(photo.id, e)}
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
              
              {albums.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 bg-black/20 hover:bg-black/40"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Move className="h-4 w-4 text-white" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <p className="text-sm font-medium mb-2">Переместить в альбом:</p>
                    <div className="space-y-2">
                      {albums.map(album => (
                        <Button 
                          key={album.id} 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-sm"
                          onClick={(e) => movePhoto(photo.id, album.id, e)}
                        >
                          {album.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderGridLayout = () => (
    <div 
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4`}
      style={getGapStyle()}
    >
      {photos.map((photo, index) => (
        <div 
          key={photo.id}
          className={`relative cursor-pointer overflow-hidden bg-gray-100 ${getPhotoSizeClasses()} ${getAspectRatioClass()}`}
          onClick={() => handlePhotoClick(photo, index)}
          onMouseEnter={() => setHoverPhotoId(photo.id)}
          onMouseLeave={() => setHoverPhotoId(null)}
        >
          {isSelectionMode && (
            <div className="absolute top-2 left-2 z-10">
              <Checkbox 
                checked={selectedPhotoIds.includes(photo.id)}
                onCheckedChange={() => togglePhotoSelection(photo.id)}
                className="h-5 w-5 bg-white/80"
              />
            </div>
          )}
          <img 
            src={photo.url} 
            alt={photo.name} 
            className={`w-full h-full object-cover transition-transform ${settings.hover === 'zoom' ? 'group-hover:scale-[1.02]' : ''}`}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-white font-medium truncate">{photo.name}</p>
          </div>
          
          {/* Hover Actions */}
          {hoverPhotoId === photo.id && !isSelectionMode && (
            <div className="absolute top-2 right-2 flex space-x-1">
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-8 w-8 bg-black/20 hover:bg-black/40"
                onClick={(e) => deletePhoto(photo.id, e)}
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
              
              {albums.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 bg-black/20 hover:bg-black/40"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Move className="h-4 w-4 text-white" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <p className="text-sm font-medium mb-2">Переместить в альбом:</p>
                    <div className="space-y-2">
                      {albums.map(album => (
                        <Button 
                          key={album.id} 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-sm"
                          onClick={(e) => movePhoto(photo.id, album.id, e)}
                        >
                          {album.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCardsLayout = () => (
    <div 
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3`}
      style={getGapStyle()}
    >
      {photos.map((photo, index) => (
        <div 
          key={photo.id}
          className="bg-white shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
          onClick={() => handlePhotoClick(photo, index)}
          onMouseEnter={() => setHoverPhotoId(photo.id)}
          onMouseLeave={() => setHoverPhotoId(null)}
        >
          {isSelectionMode && (
            <div className="absolute top-2 left-2 z-10">
              <Checkbox 
                checked={selectedPhotoIds.includes(photo.id)}
                onCheckedChange={() => togglePhotoSelection(photo.id)}
                className="h-5 w-5 bg-white/80"
              />
            </div>
          )}
          <div className={`w-full ${getPhotoSizeClasses()} ${getAspectRatioClass()} overflow-hidden relative`}>
            <img 
              src={photo.url} 
              alt={photo.name} 
              className={`w-full h-full object-cover transition-transform ${settings.hover === 'zoom' ? 'group-hover:scale-[1.02]' : ''}`}
            />
            
            {/* Hover Actions */}
            {hoverPhotoId === photo.id && !isSelectionMode && (
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="h-8 w-8 bg-black/20 hover:bg-black/40"
                  onClick={(e) => deletePhoto(photo.id, e)}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </Button>
                
                {albums.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-8 w-8 bg-black/20 hover:bg-black/40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Move className="h-4 w-4 text-white" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                      <p className="text-sm font-medium mb-2">Переместить в альбом:</p>
                      <div className="space-y-2">
                        {albums.map(album => (
                          <Button 
                            key={album.id} 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start text-sm"
                            onClick={(e) => movePhoto(photo.id, album.id, e)}
                          >
                            {album.name}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium truncate">{photo.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRowsLayout = () => (
    <div className="flex flex-col" style={{ rowGap: `${settings.gapY}px` }}>
      {photos.reduce((rows: Photo[][], photo, index) => {
        if (index % 2 === 0) rows.push([]);
        rows[rows.length - 1].push(photo);
        return rows;
      }, []).map((row, rowIndex) => (
        <div 
          key={`row-${rowIndex}`} 
          className="flex w-full" 
          style={{ columnGap: `${settings.gapX}px` }}
        >
          {row.map((photo, index) => (
            <div 
              key={photo.id}
              className={`relative cursor-pointer overflow-hidden bg-gray-100 flex-1 ${getPhotoSizeClasses()} ${getAspectRatioClass()}`}
              onClick={() => handlePhotoClick(photo, index + (rowIndex * 2))}
              onMouseEnter={() => setHoverPhotoId(photo.id)}
              onMouseLeave={() => setHoverPhotoId(null)}
            >
              {isSelectionMode && (
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox 
                    checked={selectedPhotoIds.includes(photo.id)}
                    onCheckedChange={() => togglePhotoSelection(photo.id)}
                    className="h-5 w-5 bg-white/80"
                  />
                </div>
              )}
              <img 
                src={photo.url} 
                alt={photo.name} 
                className={`w-full h-full object-cover transition-transform ${settings.hover === 'zoom' ? 'group-hover:scale-[1.02]' : ''}`}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white font-medium truncate">{photo.name}</p>
              </div>
              
              {/* Hover Actions */}
              {hoverPhotoId === photo.id && !isSelectionMode && (
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 bg-black/20 hover:bg-black/40"
                    onClick={(e) => deletePhoto(photo.id, e)}
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                  
                  {albums.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-8 w-8 bg-black/20 hover:bg-black/40"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Move className="h-4 w-4 text-white" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2">
                        <p className="text-sm font-medium mb-2">Переместить в альбом:</p>
                        <div className="space-y-2">
                          {albums.map(album => (
                            <Button 
                              key={album.id} 
                              variant="ghost" 
                              size="sm" 
                              className="w-full justify-start text-sm"
                              onClick={(e) => movePhoto(photo.id, album.id, e)}
                            >
                              {album.name}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderFilmstripLayout = () => (
    <div className="overflow-x-auto">
      <div 
        className="flex" 
        style={{ columnGap: `${settings.gapX}px` }}
      >
        {photos.map((photo, index) => (
          <div 
            key={photo.id}
            className={`relative cursor-pointer overflow-hidden bg-gray-100 flex-shrink-0 ${getPhotoSizeClasses()} ${getAspectRatioClass()} w-auto`}
            onClick={() => handlePhotoClick(photo, index)}
            onMouseEnter={() => setHoverPhotoId(photo.id)}
            onMouseLeave={() => setHoverPhotoId(null)}
          >
            {isSelectionMode && (
              <div className="absolute top-2 left-2 z-10">
                <Checkbox 
                  checked={selectedPhotoIds.includes(photo.id)}
                  onCheckedChange={() => togglePhotoSelection(photo.id)}
                  className="h-5 w-5 bg-white/80"
                />
              </div>
            )}
            <img 
              src={photo.url} 
              alt={photo.name} 
              className={`h-full w-auto object-cover transition-transform ${settings.hover === 'zoom' ? 'group-hover:scale-[1.02]' : ''}`}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-white font-medium truncate">{photo.name}</p>
            </div>
            
            {/* Hover Actions */}
            {hoverPhotoId === photo.id && !isSelectionMode && (
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="h-8 w-8 bg-black/20 hover:bg-black/40"
                  onClick={(e) => deletePhoto(photo.id, e)}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </Button>
                
                {albums.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-8 w-8 bg-black/20 hover:bg-black/40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Move className="h-4 w-4 text-white" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                      <p className="text-sm font-medium mb-2">Переместить в альбом:</p>
                      <div className="space-y-2">
                        {albums.map(album => (
                          <Button 
                            key={album.id} 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start text-sm"
                            onClick={(e) => movePhoto(photo.id, album.id, e)}
                          >
                            {album.name}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (settings.layout) {
      case 'grid':
        return renderGridLayout();
      case 'cards':
        return renderCardsLayout();
      case 'rows':
        return renderRowsLayout();
      case 'filmstrip':
        return renderFilmstripLayout();
      default:
        return renderMasonryLayout();
    }
  };

  const navigatePhotos = (direction: 'prev' | 'next') => {
    if (!selectedPhoto) return;
    
    let newIndex = selectedPhotoIndex;
    if (direction === 'prev') {
      newIndex = (selectedPhotoIndex - 1 + photos.length) % photos.length;
    } else {
      newIndex = (selectedPhotoIndex + 1) % photos.length;
    }
    
    setSelectedPhotoIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  return (
    <>
      <div className="mb-4 bg-white p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium mb-2">Настройки отображения</h2>
            <div className="flex flex-wrap gap-2">
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
              <Button 
                size="sm" 
                variant={settings.layout === 'rows' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, layout: 'rows' }))}
              >
                <Rows className="w-4 h-4 mr-1" />
                Строки
              </Button>
              <Button 
                size="sm" 
                variant={settings.layout === 'filmstrip' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, layout: 'filmstrip' }))}
              >
                <Film className="w-4 h-4 mr-1" />
                Лента
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
              <div className="flex items-center mb-1">
                <p className="text-sm flex-1">Отступ по X: {settings.gapX}px</p>
                <MoveHorizontal className="h-3 w-3 text-gray-500" />
              </div>
              <Slider
                value={[settings.gapX]}
                min={0}
                max={24}
                step={2}
                onValueChange={(value) => setSettings(prev => ({ ...prev, gapX: value[0] }))}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <div className="flex items-center mb-1">
                <p className="text-sm flex-1">Отступ по Y: {settings.gapY}px</p>
                <MoveVertical className="h-3 w-3 text-gray-500" />
              </div>
              <Slider
                value={[settings.gapY]}
                min={0}
                max={24}
                step={2}
                onValueChange={(value) => setSettings(prev => ({ ...prev, gapY: value[0] }))}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div>
            <p className="text-sm mb-1">Пропорции</p>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant={settings.aspectRatio === 'original' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, aspectRatio: 'original' }))}
              >
                <Image className="w-4 h-4 mr-1" />
                Оригинал
              </Button>
              <Button 
                size="sm" 
                variant={settings.aspectRatio === 'square' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, aspectRatio: 'square' }))}
              >
                <Square className="w-4 h-4 mr-1" />
                Квадрат
              </Button>
              <Button 
                size="sm" 
                variant={settings.aspectRatio === 'portrait' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, aspectRatio: 'portrait' }))}
              >
                <Maximize className="w-4 h-4 mr-1 rotate-90" />
                Портрет
              </Button>
              <Button 
                size="sm" 
                variant={settings.aspectRatio === 'landscape' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, aspectRatio: 'landscape' }))}
              >
                <Maximize className="w-4 h-4 mr-1" />
                Ландшафт
              </Button>
            </div>
          </div>
          
          <div>
            <p className="text-sm mb-1">Эффект при наведении</p>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant={settings.hover === 'zoom' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, hover: 'zoom' }))}
              >
                <Maximize className="w-4 h-4 mr-1" />
                Увеличение
              </Button>
              <Button 
                size="sm" 
                variant={settings.hover === 'info' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, hover: 'info' }))}
              >
                <Layers className="w-4 h-4 mr-1" />
                Информация
              </Button>
              <Button 
                size="sm" 
                variant={settings.hover === 'none' ? 'default' : 'outline'}
                onClick={() => setSettings(prev => ({ ...prev, hover: 'none' }))}
              >
                <MinusSquare className="w-4 h-4 mr-1" />
                Нет
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={isSelectionMode ? "default" : "outline"} 
              onClick={toggleSelectionMode}
              size="sm"
            >
              {isSelectionMode ? "Отменить выбор" : "Выбрать фото"}
            </Button>
            
            <Button 
              variant="destructive"
              onClick={deleteAllPhotos}
              size="sm"
            >
              <Trash className="w-4 h-4 mr-1" />
              Удалить все
            </Button>
          </div>
          
          {isSelectionMode && (
            <div className="flex gap-2">
              {albums.length > 0 && (
                <div className="flex items-center gap-2">
                  <Select
                    value={moveToAlbumId}
                    onValueChange={setMoveToAlbumId}
                  >
                    <SelectTrigger className="w-40 h-9">
                      <SelectValue placeholder="Выберите альбом" />
                    </SelectTrigger>
                    <SelectContent>
                      {albums.map(album => (
                        <SelectItem key={album.id} value={album.id}>{album.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline"
                    onClick={moveSelectedPhotos}
                    size="sm"
                    disabled={selectedPhotoIds.length === 0 || !moveToAlbumId}
                  >
                    <Move className="w-4 h-4 mr-1" />
                    Переместить
                  </Button>
                </div>
              )}
              
              <Button 
                variant="destructive"
                onClick={deleteSelectedPhotos}
                size="sm"
                disabled={selectedPhotoIds.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Удалить {selectedPhotoIds.length > 0 ? `(${selectedPhotoIds.length})` : ''}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        {renderLayout()}
      </div>

      {/* Photo Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-none shadow-none">
          {selectedPhoto && (
            <div className="relative bg-black/80 rounded-lg overflow-hidden">
              <div className="relative h-[85vh] flex items-center justify-center">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.name} 
                  className="max-w-full max-h-full object-contain"
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePhotos('prev');
                  }}
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePhotos('next');
                  }}
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full bg-black/30 hover:bg-black/50 border-none"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <X className="h-5 w-5 text-white" />
                </Button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent py-4 px-6">
                <h3 className="text-lg font-medium text-white">{selectedPhoto.name}</h3>
                <p className="text-sm text-gray-300">
                  {selectedPhotoIndex + 1} из {photos.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGrid;
