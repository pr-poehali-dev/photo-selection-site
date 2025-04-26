
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CreateAlbumCardProps {
  onCreateAlbum: (name: string) => void;
}

const CreateAlbumCard = ({ onCreateAlbum }: CreateAlbumCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [albumName, setAlbumName] = useState("");

  const handleCreate = () => {
    if (albumName.trim()) {
      onCreateAlbum(albumName);
      setAlbumName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 border-dashed flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="p-8 text-center">
          <div className="bg-photo-secondary h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-photo-primary" />
          </div>
          <p className="font-medium text-photo-primary">Создать альбом</p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать новый альбом</DialogTitle>
          </DialogHeader>
          <Input 
            placeholder="Название альбома" 
            value={albumName} 
            onChange={(e) => setAlbumName(e.target.value)}
            className="mt-2"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleCreate}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateAlbumCard;
