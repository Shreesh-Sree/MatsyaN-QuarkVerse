'use client';

import { useState } from 'react';
import { X, MapPin, Calendar, Clock, Fish, Camera, Mic, Save, Thermometer, Wind, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { FishingTrip, Catch, FishingTechnique } from '@/types/fishing-journal';
import { VoiceControls } from '../VoiceControls';

interface TripFormProps {
  onSave?: (trip: Omit<FishingTrip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onSubmit?: (trip: any) => void;
  onClose: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export function TripForm({ onSave, onSubmit, onClose, initialData, isEditing = false }: TripFormProps) {
  const [formData, setFormData] = useState(() => {
    if (initialData && isEditing) {
      return {
        date: initialData.createdAt ? new Date(initialData.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        startTime: '06:00',
        endTime: new Date(Date.now() + (initialData.duration || 360) * 60 * 1000).toISOString().split('T')[1].slice(0, 5),
        location: {
          name: initialData.location?.name || '',
          address: initialData.location?.address || '',
          coordinates: initialData.location?.coordinates || { lat: 0, lng: 0 },
          waterBody: initialData.location?.waterBody || 'lake' as const,
          access: initialData.location?.access || 'public' as const,
        },
        weather: {
          temperature: initialData.weather?.temperature || 20,
          conditions: initialData.weather?.conditions || 'sunny',
          windSpeed: initialData.weather?.windSpeed || 5,
          windDirection: initialData.weather?.windDirection || 'north',
          humidity: initialData.weather?.humidity || 60,
          pressure: initialData.weather?.pressure || 1013,
        },
        waterConditions: {
          temperature: initialData.waterConditions?.temperature || 18,
          clarity: initialData.waterConditions?.clarity || 'clear' as const,
          currentStrength: initialData.waterConditions?.currentStrength || 'moderate' as const,
          tideStatus: initialData.waterConditions?.tideStatus || 'rising' as const,
        },
        catches: initialData.catches || [],
        techniques: initialData.techniques?.map((t: any) => typeof t === 'string' ? t : t.name) || [],
        baits: initialData.bait || initialData.baits || initialData.baitUsed || [],
        equipment: initialData.equipment || [],
        companions: initialData.companions || [],
        successScore: initialData.successScore || 5,
        notes: initialData.notes || '',
        photos: initialData.photos || [],
      };
    }
    
    return {
      date: new Date().toISOString().split('T')[0],
      startTime: '06:00',
      endTime: '12:00',
      location: {
        name: '',
        address: '',
        coordinates: { lat: 0, lng: 0 },
        waterBody: 'lake' as const,
        access: 'public' as const,
      },
      weather: {
        temperature: 20,
        conditions: 'sunny',
        windSpeed: 5,
        windDirection: 'north',
        humidity: 60,
        pressure: 1013,
      },
      waterConditions: {
        temperature: 18,
        clarity: 'clear' as const,
        currentStrength: 'moderate' as const,
        tideStatus: 'rising' as const,
      },
      catches: [] as Catch[],
      techniques: [] as string[],
      baits: [] as string[],
      equipment: [] as string[],
      companions: [] as string[],
      successScore: 5,
      notes: '',
      photos: [] as string[],
    };
  });

  const [newCatch, setNewCatch] = useState({
    species: '',
    quantity: 1,
    weight: 0,
    length: 0,
    method: 'rod',
    bait: '',
    timeOfCatch: '',
    released: false,
    location: '',
    notes: '',
  });

  const calculateDuration = () => {
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60)); // in minutes
  };

  const handleAddCatch = () => {
    if (newCatch.species) {
      setFormData(prev => ({
        ...prev,
        catches: [
          ...prev.catches,
          {
            ...newCatch,
            id: Date.now().toString(),
            size: newCatch.length, // or provide a default value
            time: new Date(`${formData.date}T${newCatch.timeOfCatch || formData.startTime}`), // ensure Date type
            kept: !newCatch.released, // or provide a default value
            photos: [], // default empty array
          } as Catch
        ]
      }));
      setNewCatch({
        species: '',
        quantity: 1,
        weight: 0,
        length: 0,
        method: 'rod',
        bait: '',
        timeOfCatch: '',
        released: false,
        location: '',
        notes: '',
      });
    }
  };

  const handleRemoveCatch = (index: number) => {
    setFormData(prev => ({
      ...prev,
      catches: prev.catches.filter((_, i) => i !== index)
    }));
  };

  const handleAddItem = (field: 'techniques' | 'baits' | 'equipment' | 'companions', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleRemoveItem = (field: 'techniques' | 'baits' | 'equipment' | 'companions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleVoiceInput = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Voice commands for quick data entry
    if (lowerTranscript.includes('caught')) {
      // Parse "caught 2 bass" or "caught one trout"
      const fishMatch = lowerTranscript.match(/caught\s+(\d+|one|two|three|four|five)\s+(\w+)/);
      if (fishMatch) {
        const quantity = fishMatch[1] === 'one' ? 1 : 
                        fishMatch[1] === 'two' ? 2 :
                        fishMatch[1] === 'three' ? 3 :
                        fishMatch[1] === 'four' ? 4 :
                        fishMatch[1] === 'five' ? 5 :
                        parseInt(fishMatch[1]) || 1;
        const species = fishMatch[2];
        
        setNewCatch(prev => ({
          ...prev,
          species: species,
          quantity: quantity,
        }));
      }
    } else if (lowerTranscript.includes('location')) {
      // Parse "location is lake tahoe" or "at mirror lake"
      const locationMatch = lowerTranscript.match(/(?:location|at)\s+(?:is\s+)?(.+)/);
      if (locationMatch) {
        setFormData(prev => ({
          ...prev,
          location: { ...prev.location, name: locationMatch[1] }
        }));
      }
    } else if (lowerTranscript.includes('weather')) {
      // Parse weather conditions
      if (lowerTranscript.includes('sunny')) {
        setFormData(prev => ({
          ...prev,
          weather: { ...prev.weather, conditions: 'sunny' }
        }));
      } else if (lowerTranscript.includes('cloudy')) {
        setFormData(prev => ({
          ...prev,
          weather: { ...prev.weather, conditions: 'cloudy' }
        }));
      } else if (lowerTranscript.includes('rainy')) {
        setFormData(prev => ({
          ...prev,
          weather: { ...prev.weather, conditions: 'rainy' }
        }));
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.location.name) {
      alert('Please enter a location name');
      return;
    }
    
    const trip = {
      ...formData,
      date: new Date(formData.date),
      duration: calculateDuration(),
      baitUsed: formData.baits,
      bait: formData.baits, // for compatibility
      location: {
        ...formData.location,
        address: formData.location.address || '',
      },
      techniques: formData.techniques.map(name => ({
        name,
        description: '',
        effectiveness: 3,
        conditions: []
      })),
    };

    if (isEditing && onSubmit) {
      onSubmit(trip);
    } else if (onSave) {
      onSave(trip);
    }
    onClose();
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        {/* Voice Controls for quick data entry */}
        <VoiceControls onTranscript={handleVoiceInput} />
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 font-claude">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="date" className="font-claude text-gray-800 dark:text-gray-200">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="font-claude"
              />
            </div>
            <div>
              <Label htmlFor="startTime" className="font-claude text-gray-800 dark:text-gray-200">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="font-claude"
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="font-claude text-gray-800 dark:text-gray-200">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="font-claude"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 font-claude flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="locationName">Location Name *</Label>
                <Input
                  id="locationName"
                  placeholder="e.g., Lake Tahoe, Bass Pond"
                  value={formData.location.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, name: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="locationAddress">Address</Label>
                <Input
                  id="locationAddress"
                  placeholder="e.g., 123 Lake Rd, Tahoe City"
                  value={formData.location.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="waterBody">Water Body Type</Label>
                <Select
                  value={formData.location.waterBody}
                  onValueChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, waterBody: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lake">Lake</SelectItem>
                    <SelectItem value="river">River</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                    <SelectItem value="pond">Pond</SelectItem>
                    <SelectItem value="stream">Stream</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Weather */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 font-claude flex items-center gap-2">
              <Thermometer className="w-5 h-5" />
              Weather Conditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="weatherConditions">Conditions</Label>
                <Select
                  value={formData.weather.conditions}
                  onValueChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    weather: { ...prev.weather, conditions: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunny">Sunny</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="overcast">Overcast</SelectItem>
                    <SelectItem value="rainy">Rainy</SelectItem>
                    <SelectItem value="stormy">Stormy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Temperature: {formData.weather.temperature}°C</Label>
                <Slider
                  value={[formData.weather.temperature]}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    weather: { ...prev.weather, temperature: value[0] }
                  }))}
                  min={-10}
                  max={40}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Wind Speed: {formData.weather.windSpeed} mph</Label>
                <Slider
                  value={[formData.weather.windSpeed]}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    weather: { ...prev.weather, windSpeed: value[0] }
                  }))}
                  min={0}
                  max={30}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Water Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Water Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Water Temperature: {formData.waterConditions.temperature}°C</Label>
                <Slider
                  value={[formData.waterConditions.temperature || 18]}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    waterConditions: { ...prev.waterConditions, temperature: value[0] }
                  }))}
                  min={0}
                  max={35}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="waterClarity">Water Clarity</Label>
                <Select
                  value={formData.waterConditions.clarity}
                  onValueChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    waterConditions: { ...prev.waterConditions, clarity: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Clear</SelectItem>
                    <SelectItem value="murky">Murky</SelectItem>
                    <SelectItem value="muddy">Muddy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentStrength">Current Strength</Label>
                <Select
                  value={formData.waterConditions.currentStrength}
                  onValueChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    waterConditions: { ...prev.waterConditions, currentStrength: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calm">Calm</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="strong">Strong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Catches */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 font-claude flex items-center gap-2">
              <Fish className="w-5 h-5" />
              Catches & Species
            </h3>
            
            {/* Add New Catch */}
            <Card className="p-6 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Species (e.g., Bass, Trout)"
                  value={newCatch.species}
                  onChange={(e) => setNewCatch(prev => ({ ...prev, species: e.target.value }))}
                  className="h-11"
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newCatch.quantity}
                  onChange={(e) => setNewCatch(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="h-11"
                />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Weight (lbs)"
                  value={newCatch.weight || ''}
                  onChange={(e) => setNewCatch(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                  className="h-11"
                />
                <Button onClick={handleAddCatch} size="lg" className="h-11">
                  Add Catch
                </Button>
              </div>
            </Card>

            {/* Existing Catches */}
            {formData.catches.length > 0 && (
              <div className="space-y-2">
                {formData.catches.map((catch_, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <Badge variant="outline">
                      {catch_.quantity}x {catch_.species}
                    </Badge>
                    {(catch_.weight || 0) > 0 && (
                      <Badge variant="secondary">
                        {catch_.weight} lbs
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCatch(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Techniques, Baits & Equipment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Techniques & Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="newTechnique">Fishing Techniques</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="newTechnique"
                    placeholder="e.g., Fly fishing, Trolling"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem('techniques', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input?.value) {
                        handleAddItem('techniques', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.techniques.map((technique, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {technique}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => handleRemoveItem('techniques', index)}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="newBait">Baits Used</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="newBait"
                    placeholder="e.g., Worms, Lures"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem('baits', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input?.value) {
                        handleAddItem('baits', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.baits.map((bait, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {bait}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => handleRemoveItem('baits', index)}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="newEquipment">Equipment</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="newEquipment"
                    placeholder="e.g., Rod, Reel, Net"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem('equipment', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input?.value) {
                        handleAddItem('equipment', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.equipment.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => handleRemoveItem('equipment', index)}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Success Score */}
          <div>
            <Label>Trip Success Score: {formData.successScore}/10</Label>
            <Slider
              value={[formData.successScore]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, successScore: value[0] }))}
              min={1}
              max={10}
              step={1}
              className="mt-2"
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any observations, lessons learned, or memorable moments..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button variant="outline" onClick={onClose} className="px-6">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 px-6">
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update Trip' : 'Save Trip'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
