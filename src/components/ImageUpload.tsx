'use client';
import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onUpload, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // We'll use a server-side proxy to hide the API key if we want, 
      // but for simplicity and speed as per requirements, we can upload directly 
      // or use a simple API route. Let's use a client-side upload for now 
      // but we need the API key. 
      // Better: Use an API route to proxy the request to avoid exposing key if it wasn't public.
      // The requirements gave the key explicitly, so we can use it.
      // However, to avoid CORS issues, a server proxy is often safer.
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.url) {
        onUpload(data.url);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        {preview && (
          <img 
            src={preview} 
            alt="Preview" 
            className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm"
          />
        )}
        <label className="cursor-pointer bg-pastel-purple hover:bg-purple-100 px-4 py-2 rounded-xl flex items-center gap-2 text-pastel-purple-dark font-medium transition-colors shadow-sm">
          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}
