'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { MapPin, Play } from 'lucide-react';

/**
 * Analysis Form Component
 * Form for starting a new buildable area analysis
 */
export default function AnalysisForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    site_name: '',
    latitude: '',
    longitude: '',
    bbox_size_meters: 1000, // Increased default for better DEM coverage
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.site_name.trim()) {
      newErrors.site_name = 'Site name is required';
    }
    
    const lat = parseFloat(formData.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = 'Valid latitude required (-90 to 90)';
    }
    
    const lng = parseFloat(formData.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.longitude = 'Valid longitude required (-180 to 180)';
    }
    
    const bbox = parseInt(formData.bbox_size_meters);
    if (isNaN(bbox) || bbox < 100 || bbox > 5000) {
      newErrors.bbox_size_meters = 'Size must be between 100 and 5000 meters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const request = {
      site_name: formData.site_name.trim(),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      bbox_size_meters: parseInt(formData.bbox_size_meters),
    };
    
    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        label="Site Name"
        placeholder="e.g., Downtown Development Site"
        value={formData.site_name}
        onChange={(e) => handleChange('site_name', e.target.value)}
        error={errors.site_name}
        required
        disabled={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          label="Latitude"
          placeholder="37.7749"
          step="0.000001"
          value={formData.latitude}
          onChange={(e) => handleChange('latitude', e.target.value)}
          error={errors.latitude}
          required
          disabled={loading}
        />

        <Input
          type="number"
          label="Longitude"
          placeholder="-122.4194"
          step="0.000001"
          value={formData.longitude}
          onChange={(e) => handleChange('longitude', e.target.value)}
          error={errors.longitude}
          required
          disabled={loading}
        />
      </div>

      <Input
        type="number"
        label="Analysis Area Size (meters)"
        placeholder="500"
        step="50"
        value={formData.bbox_size_meters}
        onChange={(e) => handleChange('bbox_size_meters', e.target.value)}
        error={errors.bbox_size_meters}
        required
        disabled={loading}
      />

      <div className="flex gap-3 pt-2">
        <Button 
          type="submit" 
          disabled={loading}
          icon={<Play size={16} />}
          className="flex-1"
        >
          {loading ? 'Starting Analysis...' : 'Start Analysis'}
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            // Get current location
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                handleChange('latitude', position.coords.latitude.toString());
                handleChange('longitude', position.coords.longitude.toString());
              });
            }
          }}
          icon={<MapPin size={16} />}
          disabled={loading}
        >
          Use My Location
        </Button>
      </div>

      <p className="text-xs text-gray-600 mt-2">
        * Analysis will evaluate buildable area considering slope, water bodies, and other constraints
      </p>
    </form>
  );
}
