
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PropertyDetailsLoading = () => {
  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <Button variant="ghost" className="mb-4 pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to listings
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Title and location skeletons */}
            <Skeleton className="h-10 w-2/3 mb-2" />
            <Skeleton className="h-5 w-1/3 mb-6" />
            
            {/* Main image skeleton */}
            <Skeleton className="aspect-video w-full mb-4" />
            
            {/* Image gallery skeletons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
            
            {/* Property features skeleton */}
            <div className="flex flex-wrap gap-4 mb-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-28" />
              ))}
            </div>
            
            {/* Description skeleton */}
            <Skeleton className="h-6 w-1/4 mb-3" />
            <div className="space-y-2 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            {/* Features skeleton */}
            <Skeleton className="h-6 w-1/4 mb-3" />
            <div className="grid grid-cols-2 gap-2 mb-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-5/6" />
              ))}
            </div>
            
            {/* Similar properties skeleton */}
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {/* Sidebar card skeleton */}
            <div className="border rounded-lg shadow-sm p-6">
              {/* Price skeleton */}
              <div className="flex justify-between mb-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              
              {/* Action buttons skeleton */}
              <Skeleton className="h-10 w-full mb-4" />
              <div className="flex gap-2 mb-6">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </div>
              
              {/* Property details skeleton */}
              <Skeleton className="h-6 w-1/3 mb-3" />
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
              
              {/* Map skeleton */}
              <Skeleton className="h-6 w-1/3 mb-3" />
              <Skeleton className="aspect-[4/3] w-full mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsLoading;
