
import { useState } from "react";
import { Upload, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PhotoUploadProps {
  albumId: string;
  onPhotoUploaded: () => void;
}

const PhotoUpload = ({ albumId, onPhotoUploaded }: PhotoUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      // Initialize progress for new files
      const newProgress = {...uploadProgress};
      newFiles.forEach(file => {
        newProgress[file.name] = 0;
      });
      setUploadProgress(newProgress);
    }
  };
  
  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    
    const newProgress = {...uploadProgress};
    delete newProgress[fileName];
    setUploadProgress(newProgress);
  };
  
  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload for each file
    for (const file of files) {
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
        
        // Wait for 200ms to simulate upload progress
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    // In a real app, you would upload the files to a server here
    // For now, we'll just simulate it
    
    setTimeout(() => {
      setIsUploading(false);
      setFiles([]);
      setUploadProgress({});
      onPhotoUploaded();
    }, 500);
  };
  
  return (
    <div className="mt-8 mb-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Загрузка фотографий</h2>
      
      <div className="mb-4">
        <label className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors">
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
        <div className="mb-4">
          <h3 className="font-medium mb-2">Выбранные файлы ({files.length})</h3>
          <div className="space-y-2 max-h-52 overflow-y-auto border border-gray-200 rounded-lg p-2">
            {files.map(file => (
              <div key={file.name} className="flex items-center bg-gray-50 p-2 rounded-md">
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
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
      )}
      
      <Button 
        onClick={uploadFiles}
        disabled={files.length === 0 || isUploading}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Загрузка..." : "Загрузить фотографии"}
      </Button>
    </div>
  );
};

export default PhotoUpload;
