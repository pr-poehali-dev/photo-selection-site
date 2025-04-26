
import { useState } from "react";
import { Upload, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { addPhotoToAlbum } from "@/lib/data";

interface PhotoUploadProps {
  albumId: string;
  onPhotoUploaded: () => void;
}

const PhotoUpload = ({ albumId, onPhotoUploaded }: PhotoUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [photoNames, setPhotoNames] = useState<{[key: string]: string}>({});
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      // Initialize progress for new files
      const newProgress = {...uploadProgress};
      const newNames = {...photoNames};
      
      newFiles.forEach(file => {
        newProgress[file.name] = 0;
        // Use filename without extension as default photo name
        const baseName = file.name.split('.').slice(0, -1).join('.');
        newNames[file.name] = baseName || file.name;
      });
      
      setUploadProgress(newProgress);
      setPhotoNames(newNames);
    }
  };
  
  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    
    const newProgress = {...uploadProgress};
    delete newProgress[fileName];
    setUploadProgress(newProgress);
    
    const newNames = {...photoNames};
    delete newNames[fileName];
    setPhotoNames(newNames);
  };
  
  const handleNameChange = (fileName: string, newName: string) => {
    setPhotoNames(prev => ({
      ...prev,
      [fileName]: newName
    }));
  };
  
  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    let completedFiles = 0;
    const totalFiles = files.length;
    
    // Process each file
    for (const file of files) {
      // Create a FileReader to read the file as data URL
      const reader = new FileReader();
      
      // Setup progress updates
      for (let progress = 0; progress <= 90; progress += 10) {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
        
        // Update overall progress
        const currentProgressValues = Object.values({...uploadProgress, [file.name]: progress});
        const currentOverallProgress = (currentProgressValues.reduce((sum, val) => sum + val, 0) / 
          (currentProgressValues.length * 100)) * 100 * (completedFiles / totalFiles) + 
          (progress / 100) * (100 / totalFiles);
        
        setOverallProgress(Math.min(currentOverallProgress, 95));
        
        // Simulate upload progress with short delays
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Return a promise that resolves when the file is read
      const fileDataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      // Add the photo to the album with the custom name
      addPhotoToAlbum(albumId, photoNames[file.name], fileDataUrl);
      
      // Mark upload as complete
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 100
      }));
      
      completedFiles++;
      setOverallProgress((completedFiles / totalFiles) * 100);
      
      // Small delay between files
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Cleanup after all uploads
    setTimeout(() => {
      setIsUploading(false);
      setFiles([]);
      setUploadProgress({});
      setPhotoNames({});
      setOverallProgress(0);
      onPhotoUploaded();
    }, 500);
  };
  
  return (
    <div className="mt-8 mb-4 bg-white p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Загрузка фотографий</h2>
      
      <div className="mb-4">
        <label className="block w-full p-6 border-2 border-dashed border-gray-300 text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="flex flex-col items-center">
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-gray-600 mb-1">Перетащите файлы сюда или кликните для выбора</span>
            <span className="text-sm text-gray-500">JPG, PNG, WebP</span>
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
      
      {files.length > 0 && (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Общий прогресс</h3>
              <span className="text-sm">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Выбранные файлы ({files.length})</h3>
            <div className="space-y-2 max-h-52 overflow-y-auto border border-gray-200 p-2">
              {files.map(file => (
                <div key={file.name} className="flex items-center bg-gray-50 p-2">
                  <div className="flex-shrink-0 w-16 h-16 mr-3 bg-gray-100 overflow-hidden">
                    {file.type.startsWith('image/') && (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <input
                        type="text"
                        value={photoNames[file.name] || ''}
                        onChange={(e) => handleNameChange(file.name, e.target.value)}
                        className="text-sm w-full border border-gray-300 px-2 py-1"
                        placeholder="Название фото"
                        disabled={isUploading}
                      />
                    </div>
                    <p className="text-xs text-gray-500 truncate">{file.name}</p>
                    <Progress value={uploadProgress[file.name] || 0} className="h-1.5 mt-1" />
                  </div>
                  {uploadProgress[file.name] === 100 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  ) : (
                    <button 
                      onClick={() => removeFile(file.name)}
                      className="p-1 text-gray-500 hover:text-red-500"
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      <Button 
        onClick={uploadFiles}
        disabled={files.length === 0 || isUploading}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? `Загрузка... ${Math.round(overallProgress)}%` : "Загрузить фотографии"}
      </Button>
    </div>
  );
};

export default PhotoUpload;
