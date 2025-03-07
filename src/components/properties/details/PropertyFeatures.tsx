
import React from 'react';

interface PropertyFeaturesProps {
  features: string[];
}

const PropertyFeatures = ({ features }: PropertyFeaturesProps) => {
  if (!features || features.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Features</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyFeatures;
