"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Fish, 
  MapPin, 
  Clock, 
  Thermometer, 
  Wind, 
  Eye, 
  Waves,
  Camera,
  Plus,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fishingDataService } from '@/services/fishingData';

const fishingTripSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  locationName: z.string().min(1, 'Location name is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  species: z.array(z.string()).min(1, 'At least one species is required'),
  catchCount: z.number().min(0, 'Catch count must be positive'),
  totalWeight: z.number().min(0, 'Total weight must be positive'),
  averageSize: z.number().min(0, 'Average size must be positive'),
  temperature: z.number().min(-50).max(60),
  windSpeed: z.number().min(0).max(200),
  visibility: z.number().min(0).max(50),
  waveHeight: z.number().min(0).max(30),
  equipment: z.array(z.string()).min(1, 'At least one equipment item is required'),
  duration: z.number().min(0.1, 'Duration must be at least 0.1 hours'),
  success: z.boolean(),
  notes: z.string().optional(),
});

const commonSpecies = [
  'Bass', 'Trout', 'Salmon', 'Tuna', 'Mackerel', 'Sardine', 'Snapper', 'Grouper',
  'Catfish', 'Pike', 'Perch', 'Carp', 'Cod', 'Haddock', 'Flounder', 'Sole'
];

const commonEquipment = [
  'Rod & Reel', 'Fishing Line', 'Hooks', 'Sinkers', 'Bobbers', 'Net', 'Tackle Box',
  'Bait', 'Lures', 'Pliers', 'Cooler', 'Boat', 'Kayak', 'Waders'
];

export function FishingTripEntry() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [customSpecies, setCustomSpecies] = useState('');
  const [customEquipment, setCustomEquipment] = useState('');

  const form = useForm<z.infer<typeof fishingTripSchema>>({
    resolver: zodResolver(fishingTripSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      locationName: '',
      latitude: 0,
      longitude: 0,
      species: [],
      catchCount: 0,
      totalWeight: 0,
      averageSize: 0,
      temperature: 25,
      windSpeed: 10,
      visibility: 10,
      waveHeight: 1,
      equipment: [],
      duration: 4,
      success: false,
      notes: '',
    },
  });

  const addSpecies = (species: string) => {
    if (species && !selectedSpecies.includes(species)) {
      const newSpecies = [...selectedSpecies, species];
      setSelectedSpecies(newSpecies);
      form.setValue('species', newSpecies);
    }
  };

  const removeSpecies = (species: string) => {
    const newSpecies = selectedSpecies.filter(s => s !== species);
    setSelectedSpecies(newSpecies);
    form.setValue('species', newSpecies);
  };

  const addCustomSpecies = () => {
    if (customSpecies.trim()) {
      addSpecies(customSpecies.trim());
      setCustomSpecies('');
    }
  };

  const addEquipment = (equipment: string) => {
    if (equipment && !selectedEquipment.includes(equipment)) {
      const newEquipment = [...selectedEquipment, equipment];
      setSelectedEquipment(newEquipment);
      form.setValue('equipment', newEquipment);
    }
  };

  const removeEquipment = (equipment: string) => {
    const newEquipment = selectedEquipment.filter(e => e !== equipment);
    setSelectedEquipment(newEquipment);
    form.setValue('equipment', newEquipment);
  };

  const addCustomEquipment = () => {
    if (customEquipment.trim()) {
      addEquipment(customEquipment.trim());
      setCustomEquipment('');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('latitude', position.coords.latitude);
          form.setValue('longitude', position.coords.longitude);
          toast({
            title: 'Location Updated',
            description: 'Current GPS coordinates have been set.',
          });
        },
        (error) => {
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Unable to get current location. Please enter coordinates manually.',
          });
        }
      );
    }
  };

  const onSubmit = async (values: z.infer<typeof fishingTripSchema>) => {
    if (!user?.uid) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Please log in to save fishing trips.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const tripData = {
        date: values.date,
        location: {
          lat: values.latitude,
          lng: values.longitude,
          name: values.locationName,
        },
        species: values.species,
        catch: {
          count: values.catchCount,
          totalWeight: values.totalWeight,
          averageSize: values.averageSize,
        },
        weatherConditions: {
          temperature: values.temperature,
          windSpeed: values.windSpeed,
          visibility: values.visibility,
          waveHeight: values.waveHeight,
        },
        equipment: values.equipment,
        duration: values.duration,
        success: values.success,
        notes: values.notes || '',
      };

      const tripId = await fishingDataService.createFishingTrip(user.uid, tripData);

      toast({
        title: 'Success',
        description: 'Fishing trip saved successfully!',
      });

      // Reset form
      form.reset();
      setSelectedSpecies([]);
      setSelectedEquipment([]);
    } catch (error) {
      console.error('Error saving fishing trip:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save fishing trip. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
          <Fish className="w-6 h-6 text-custom-primary" />
          Log Fishing Trip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-claude">Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="font-claude" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-claude">Duration (hours)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className="font-claude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="locationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-claude flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Marina Bay, Local Lake" className="font-claude" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-claude">Latitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="any" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="font-claude"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-claude">Longitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="any" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="font-claude"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end">
                  <Button 
                    type="button" 
                    onClick={getCurrentLocation}
                    variant="outline"
                    className="w-full font-claude"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Use GPS
                  </Button>
                </div>
              </div>
            </div>

            {/* Species Selection */}
            <div className="space-y-4">
              <FormLabel className="font-claude">Species Caught</FormLabel>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSpecies.map((species) => (
                  <Badge key={species} variant="secondary" className="font-claude">
                    {species}
                    <button
                      type="button"
                      onClick={() => removeSpecies(species)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {commonSpecies.map((species) => (
                  <Button
                    key={species}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSpecies(species)}
                    disabled={selectedSpecies.includes(species)}
                    className="font-claude"
                  >
                    {species}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Custom species"
                  value={customSpecies}
                  onChange={(e) => setCustomSpecies(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSpecies())}
                  className="font-claude"
                />
                <Button type="button" onClick={addCustomSpecies} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Catch Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="catchCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-claude">Number of Fish</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="font-claude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-claude">Total Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className="font-claude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="averageSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-claude">Average Size (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className="font-claude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Weather Conditions */}
            <div className="space-y-4">
              <FormLabel className="font-claude flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Weather Conditions
              </FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-claude">Temperature (°C)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="font-claude"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="windSpeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-claude">Wind Speed (km/h)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="font-claude"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-claude">Visibility (km)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="font-claude"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="waveHeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-claude">Wave Height (m)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="font-claude"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Equipment */}
            <div className="space-y-4">
              <FormLabel className="font-claude">Equipment Used</FormLabel>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedEquipment.map((equipment) => (
                  <Badge key={equipment} variant="secondary" className="font-claude">
                    {equipment}
                    <button
                      type="button"
                      onClick={() => removeEquipment(equipment)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {commonEquipment.map((equipment) => (
                  <Button
                    key={equipment}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addEquipment(equipment)}
                    disabled={selectedEquipment.includes(equipment)}
                    className="font-claude"
                  >
                    {equipment}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Custom equipment"
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomEquipment())}
                  className="font-claude"
                />
                <Button type="button" onClick={addCustomEquipment} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Success & Notes */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="success"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-custom-secondary/20 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-claude">Successful Trip</FormLabel>
                      <div className="text-sm text-muted-foreground font-claude">
                        Mark this trip as successful based on your goals
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-claude">Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Additional notes about the trip, conditions, techniques used, etc."
                        className="min-h-[100px] font-claude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-custom-primary hover:bg-custom-primary/90 text-custom-white font-claude"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Trip...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Fishing Trip
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
