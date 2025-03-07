
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Property } from '@/components/properties/PropertyCard';

interface SimilarPropertiesProps {
  properties: Property[];
}

const SimilarProperties = ({ properties }: SimilarPropertiesProps) => {
  const navigate = useNavigate();
  
  if (!properties || properties.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Similar Properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map(property => (
          <Card key={property.id} className="overflow-hidden">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src={property.images?.[0] || '/placeholder.svg'}
                alt={property.title}
                className="h-full w-full object-cover transition-all hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold line-clamp-1">{property.title}</h3>
              <p className="text-muted-foreground text-sm">
                {property.location}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">
                  €{property.price.toLocaleString()}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;
