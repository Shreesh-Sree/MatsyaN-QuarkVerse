'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Fish, 
  MapPin, 
  Calendar, 
  Clock, 
  Thermometer, 
  Wind,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFishingLogs } from '@/hooks/use-fishing-logs';
import { TripForm } from './TripForm';
import { FishingAnalytics } from '@/components/FishingAnalytics';
import { useToast } from '@/hooks/use-toast';
import { format, isValid } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function EnhancedFishingJournal() {
  const { logs, loading, error, editLog, deleteLog, addLog } = useFishingLogs();
  const { toast } = useToast();
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [editingTrip, setEditingTrip] = useState<string | null>(null);
  const [viewingTrip, setViewingTrip] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('all');

  // Safe date formatting function
  const formatSafeDate = (dateValue: any, formatString: string = 'MMM d, yyyy') => {
    if (!dateValue) return 'No date';
    
    let date: Date;
    if (dateValue?.toDate && typeof dateValue.toDate === 'function') {
      // Firestore Timestamp
      date = dateValue.toDate();
    } else if (dateValue?.seconds) {
      // Firestore Timestamp object
      date = new Date(dateValue.seconds * 1000);
    } else {
      // Regular date string or Date object
      date = new Date(dateValue);
    }
    
    return isValid(date) ? format(date, formatString) : 'Invalid date';
  };

  const handleAdd = async (tripData: any) => {
    try {
      await addLog(tripData);
      setIsAddingTrip(false);
      toast({
        title: 'Success',
        description: 'Fishing trip added successfully!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add fishing trip. Please try again.',
      });
    }
  };

  const handleEdit = async (tripId: string, tripData: any) => {
    try {
      await editLog(tripId, tripData);
      setEditingTrip(null);
      toast({
        title: 'Success',
        description: 'Fishing trip updated successfully!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update fishing trip. Please try again.',
      });
    }
  };

  const handleDelete = async (tripId: string) => {
    try {
      await deleteLog(tripId);
      toast({
        title: 'Success',
        description: 'Fishing trip deleted successfully!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete fishing trip. Please try again.',
      });
    }
  };

  const getTripToEdit = (tripId: string) => {
    return logs.find(log => log.id === tripId);
  };

  // Filter logs based on search and filter criteria
  const filteredLogs = logs.filter(trip => {
    const matchesSearch = searchTerm === '' || 
      (trip.location?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.catches || []).some(c => (c.species || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
      (trip.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecies = filterSpecies === 'all' || 
      (trip.catches || []).some(c => (c.species || '') === filterSpecies);
    
    return matchesSearch && matchesSpecies;
  });

  // Get unique species for filter dropdown
  const allSpecies = Array.from(new Set(logs.flatMap(trip => (trip.catches || []).map(c => c.species || 'Unknown')).filter(Boolean)));

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-primary"></div>
            <span className="ml-2">Loading fishing journal...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Error loading fishing journal: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Fish className="w-5 h-5 text-custom-primary" />
              Enhanced Fishing Journal
            </CardTitle>
            <Dialog open={isAddingTrip} onOpenChange={setIsAddingTrip}>
              <DialogTrigger asChild>
                <Button className="bg-custom-primary hover:bg-custom-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trip
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Fishing Trip</DialogTitle>
                </DialogHeader>
                <TripForm 
                  onClose={() => setIsAddingTrip(false)} 
                  onSave={handleAdd}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="journal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="journal">Journal Entries</TabsTrigger>
              <TabsTrigger value="analytics">Analytics & Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="journal" className="space-y-4">
              {/* Search and Filter Controls */}
              {logs.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search trips, locations, species, or notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterSpecies} onValueChange={setFilterSpecies}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Species</SelectItem>
                      {allSpecies.map(species => (
                        <SelectItem key={species} value={species}>{species}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {filteredLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Fish className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    {logs.length === 0 ? 'No fishing trips logged yet' : 'No trips match your filters'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {logs.length === 0 ? 'Start by adding your first fishing trip!' : 'Try adjusting your search or filters'}
                  </p>
                  {logs.length === 0 && (
                    <Button 
                      onClick={() => setIsAddingTrip(true)}
                      className="bg-custom-primary hover:bg-custom-primary/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Trip
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredLogs.map((trip) => (
                    <Card key={trip.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-custom-primary" />
                              <h3 className="font-semibold">{trip.location.name}</h3>
                              <Badge 
                                variant={trip.syncStatus === 'synced' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {trip.syncStatus}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatSafeDate(trip.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {Math.floor((trip.duration || 0) / 60)}h {(trip.duration || 0) % 60}m
                              </div>
                              <div className="flex items-center gap-1">
                                <Thermometer className="w-3 h-3" />
                                {trip.weather?.temperature || 'N/A'}°C
                              </div>
                              <div className="flex items-center gap-1">
                                <Fish className="w-3 h-3" />
                                {(trip.catches || []).reduce((sum, c) => sum + (c.quantity || 0), 0)} catches
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Dialog open={viewingTrip === trip.id} onOpenChange={(open) => setViewingTrip(open ? trip.id! : null)}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Trip Details</DialogTitle>
                                </DialogHeader>
                                <TripDetails trip={trip} />
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog open={editingTrip === trip.id} onOpenChange={(open) => setEditingTrip(open ? trip.id! : null)}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Fishing Trip</DialogTitle>
                                </DialogHeader>
                                {editingTrip && getTripToEdit(editingTrip) && (
                                  <TripForm 
                                    initialData={getTripToEdit(editingTrip)!}
                                    onClose={() => setEditingTrip(null)}
                                    onSubmit={(data) => handleEdit(editingTrip, data)}
                                    isEditing
                                  />
                                )}
                              </DialogContent>
                            </Dialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Fishing Trip</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this fishing trip? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(trip.id!)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        {/* Catches Summary */}
                        {(trip.catches || []).length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-2">Catches:</h4>
                            <div className="flex flex-wrap gap-2">
                              {(trip.catches || []).map((catch_, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {catch_.quantity || 0}x {catch_.species || 'Unknown'}
                                  {catch_.weight && ` (${catch_.weight}kg)`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Bait & Techniques */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          {(trip.bait || []).length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Bait:</h4>
                              <div className="flex flex-wrap gap-1">
                                {(trip.bait || []).map((bait, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">{bait}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {(trip.techniques || []).length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Techniques:</h4>
                              <div className="flex flex-wrap gap-1">
                                {(trip.techniques || []).map((technique, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">{typeof technique === 'string' ? technique : technique.name || 'Unknown'}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Notes */}
                        {trip.notes && (
                          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                            {trip.notes}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <FishingAnalytics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Trip Details Component
function TripDetails({ trip }: { trip: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trip Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-custom-primary" />
              <span className="font-medium">Location:</span>
              <span>{trip.location.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-custom-primary" />
              <span className="font-medium">Date:</span>
              <span>{formatSafeDate(trip.createdAt, 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-custom-primary" />
              <span className="font-medium">Duration:</span>
              <span>{Math.floor(trip.duration / 60)}h {trip.duration % 60}m</span>
            </div>
          </CardContent>
        </Card>

        {/* Weather */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weather Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-custom-primary" />
              <span className="font-medium">Temperature:</span>
              <span>{trip.weather.temperature}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-custom-primary" />
              <span className="font-medium">Conditions:</span>
              <span>{trip.weather.conditions}</span>
            </div>
            {trip.weather.windSpeed && (
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-custom-primary" />
                <span className="font-medium">Wind Speed:</span>
                <span>{trip.weather.windSpeed} mph</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Catches */}
      {(trip.catches || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Catches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {(trip.catches || []).map((catch_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Fish className="w-5 h-5 text-custom-primary" />
                    <div>
                      <div className="font-medium">{catch_.species || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">Quantity: {catch_.quantity || 0}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {catch_.weight && <div className="font-medium">{catch_.weight} kg</div>}
                    {catch_.size && <div className="text-sm text-muted-foreground">{catch_.size} cm</div>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bait & Techniques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(trip.bait || []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bait Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(trip.bait || []).map((bait, index) => (
                  <Badge key={index} variant="outline">{bait}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(trip.techniques || []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Techniques Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(trip.techniques || []).map((technique, index) => (
                  <Badge key={index} variant="outline">{typeof technique === 'string' ? technique : technique.name || 'Unknown'}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notes */}
      {trip.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{trip.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
