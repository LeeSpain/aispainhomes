
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Property } from '@/components/properties/PropertyCard';

// Helper function to safely display location
const getLocationDisplay = (location: string | any) => {
  if (typeof location === 'string') {
    return location;
  }
  
  // Handle case where location might be an object but without city property
  return location?.city || 'Unknown location';
};

interface PropertiesTabProps {
  properties: Property[];
  isLoading: boolean;
}

const PropertiesTab = ({ properties, isLoading }: PropertiesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Management</CardTitle>
        <CardDescription>
          View and manage all properties in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-muted-foreground">
              Showing {properties.length} properties
            </span>
          </div>
          <Button size="sm">Add Property</Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading properties...
                  </TableCell>
                </TableRow>
              ) : properties.length > 0 ? (
                properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.id.substring(0, 8)}</TableCell>
                    <TableCell>{property.title}</TableCell>
                    <TableCell>{getLocationDisplay(property.location)}</TableCell>
                    <TableCell>€{property.price.toLocaleString()}</TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No properties found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertiesTab;
