
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
}

const PropertyImageGallery = ({ images, title }: PropertyImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // If no images are provided, use a placeholder
  const displayImages = images.length > 0 
    ? images 
    : ['/placeholder.svg'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        <img
          src={displayImages[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className="h-full w-full object-cover transition-all duration-300"
        />
      </div>
      
      {displayImages.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
          
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "h-1.5 w-4 rounded-full transition-all duration-300",
                  currentImageIndex === index 
                    ? "bg-white" 
                    : "bg-white/40 hover:bg-white/60"
                )}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyImageGallery;
