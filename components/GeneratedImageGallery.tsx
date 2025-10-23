
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import type { AspectRatio } from '../types';

interface GeneratedImageGalleryProps {
  images: string[];
  isLoading: boolean;
  onDownload: (imageUrl: string, index: number) => void;
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

const SkeletonCard: React.FC<{aspectRatio: AspectRatio}> = ({ aspectRatio }) => (
    <div className={`bg-gray-700 rounded-xl animate-pulse ${getAspectRatioClass(aspectRatio)}`}></div>
);

export const GeneratedImageGallery: React.FC<GeneratedImageGalleryProps> = ({ images, isLoading, onDownload, aspectRatio }) => {
    const totalImages = 6;

    if (!isLoading && images.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-100 text-center mb-8">Generated Poses</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                {images.map((image, index) => (
                    <div key={index} className={`group relative bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 ${getAspectRatioClass(aspectRatio)}`}>
                        <img src={image} alt={`Generated pose ${index + 1}`} className="w-full h-full object-cover"/>
                        <button
                            onClick={() => onDownload(image, index)}
                            className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-gray-200 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                            aria-label={`Download pose ${index + 1}`}
                        >
                            <DownloadIcon />
                        </button>
                    </div>
                ))}
                {isLoading && Array.from({ length: totalImages - images.length }).map((_, index) => (
                    <SkeletonCard key={`skeleton-${index}`} aspectRatio={aspectRatio} />
                ))}
            </div>
        </div>
    );
};
