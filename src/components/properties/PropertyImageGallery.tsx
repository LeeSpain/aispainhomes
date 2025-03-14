
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
}

const PropertyImageGallery = ({ images, title }: PropertyImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const imageRefs = useRef<HTMLImageElement[]>([]);

  // If no images are provided, use a placeholder
  const displayImages = images.length > 0 
    ? images 
    : ['/placeholder.svg'];
  
  // Preload the current image and the next one
  useEffect(() => {
    // Initialize imageRefs array
    imageRefs.current = imageRefs.current.slice(0, displayImages.length);
    
    // Create a new Image object to preload
    const preloadImages = () => {
      const imagesToLoad = [
        currentImageIndex,
        (currentImageIndex + 1) % displayImages.length,
        (currentImageIndex - 1 + displayImages.length) % displayImages.length
      ];
      
      imagesToLoad.forEach(idx => {
        if (!loadedImages[idx]) {
          const img = new Image();
          img.src = displayImages[idx];
          img.onload = () => {
            setLoadedImages(prev => ({...prev, [idx]: true}));
          };
          img.onerror = () => {
            // On error, mark as loaded but will use fallback
            setLoadedImages(prev => ({...prev, [idx]: true}));
          };
        }
      });
    };
    
    preloadImages();
  }, [displayImages, currentImageIndex, loadedImages]);

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

  const isCurrentImageLoaded = loadedImages[currentImageIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
        {!isCurrentImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-full w-full absolute" />
          </div>
        )}
        
        <img
          ref={el => {
            if (el) imageRefs.current[currentImageIndex] = el;
          }}
          src={displayImages[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            isCurrentImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => {
            setLoadedImages(prev => ({...prev, [currentImageIndex]: true}));
          }}
          onError={(e) => {
            // Fallback to placeholder on error
            (e.target as HTMLImageElement).src = '/placeholder.svg';
            setLoadedImages(prev => ({...prev, [currentImageIndex]: true}));
          }}
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
