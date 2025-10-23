import React from 'react';
import type { AspectRatio } from '../types';

interface ImageUploaderProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  imagePreviewUrl?: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  aspectRatio: AspectRatio;
}

const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
        case '16:9': return 'aspect-[16/9]';
        case '1:1': return 'aspect-square';
        case '9:16':
        default: return 'aspect-[9/16]';
    }
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, icon, imagePreviewUrl, onChange, aspectRatio }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-300 mb-2 text-center">{title}</h3>
      <label
        htmlFor={id}
        className={`group cursor-pointer w-full bg-gray-800 rounded-xl border-2 border-dashed border-gray-600 hover:border-pink-500 hover:bg-gray-700 transition-all duration-300 flex flex-col justify-center items-center p-4 text-center overflow-hidden ${getAspectRatioClass(aspectRatio)}`}
      >
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt={title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="space-y-2 text-gray-400 group-hover:text-pink-500 transition-colors">
            {icon}
            <p className="font-medium">Click to upload</p>
            <p className="text-xs">PNG, JPG, WEBP</p>
          </div>
        )}
        <input
          id={id}
          type="file"
          className="sr-only"
          accept="image/png, image/jpeg, image/webp"
          onChange={onChange}
        />
      </label>
    </div>
  );
};