
import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, ImagePlus } from "lucide-react";
import { Album } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface AlbumCardProps {
  album: Album;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

const AlbumCard = ({ album, onRename, onDelete }: AlbumCardProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newName, setNewName] = useState(album.name);

  const handleRename = () => {
    onRename(album.id, newName);
    setIsRenameDialogOpen(false);
  };

  const handleDelete = () => {
    onDelete(album.id);
    setIsDeleteDialogOpen(false);
  };

  const coverImage = album.photos.length > 0 
    ? album.photos[0].url 
    : "https://via.placeholder.com/300x200/f3f4f6/8E9196?text=Нет+фото";

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
        <Link to={`/album/${album.id}`} className="block">
          <div className="aspect-video relative bg-gray-100 overflow-hidden">
            <img 
              src={coverImage} 
              alt={album.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gray-700 bg-opacity-70 text-white py-1 px-2 text-sm">
              {album.photos.length} фото
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-medium text-photo-primary">{album.name}</h3>
          </div>
        </Link>
        <div className="flex border-t border-gray-200">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 rounded-none text-photo-muted hover:text-photo-primary"
            onClick={() => setIsRenameDialogOpen(true)}
          >
            <Pencil size={16} className="mr-1" />
            Переименовать
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 rounded-none text-photo-danger hover:text-photo-danger hover:bg-red-50"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 size={16} className="mr-1" />
            Удалить
          </Button>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Переименовать альбом</DialogTitle>
          </DialogHeader>
          <Input 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            className="mt-2"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleRename}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить альбом</DialogTitle>
          </DialogHeader>
          <p className="py-4">Вы уверены, что хотите удалить альбом "{album.name}"? Это действие нельзя отменить.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
            <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AlbumCard;
