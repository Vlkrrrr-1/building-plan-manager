import React from "react";
import type { ImageDocType } from "../db/rxdb";

interface ImageGalleryProps {
  images: ImageDocType[];
  selectedImageId?: string;
  onSelectImage: (imageId: string) => void;
  onDeleteImage: (imageId: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  selectedImageId,
  onSelectImage,
  onDeleteImage,
}) => {
  return (
    <div className="w-full bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-emerald-800 mb-3">
        Your Images ({images.length})
      </h3>
      <div className="grid grid-cols-4 gap-3 max-h-32 overflow-y-auto">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all"
            style={{
              borderColor: selectedImageId === image.id ? "#059669" : "#e5e7eb",
            }}
            onClick={() => onSelectImage(image.id)}
          >
            <img
              src={image.imageData}
              alt={image.name}
              className="w-full h-20 object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
              <button
                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Delete this image?")) {
                    onDeleteImage(image.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
              <p className="text-white text-xs truncate">{image.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
