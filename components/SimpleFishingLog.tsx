'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Fish, Plus, Calendar, MapPin, BarChart3, TrendingUp, Award, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSimpleFishingLogs } from '@/hooks/use-simple-fishing-logs';

export function SimpleFishingLog() {
  const { toast } = useToast();
  const { entries, analytics, addEntry } = useSimpleFishingLogs();
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    species: '',
    quantity: 0,
    weight: 0,
    duration: 0,
    notes: ''
  });

  const handleSubmit = () => {
    if (!formData.location || !formData.species) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in location and species.',
      });
      return;
    }

    addEntry({
      ...formData,
      success: formData.quantity > 0
    });

    toast({
      title: 'Entry Added',
      description: 'Fishing log entry saved successfully!',
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      location: '',
      species: '',
      quantity: 0,
      weight: 0,
      duration: 0,
      notes: ''
    });
    setIsAddingEntry(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Fish className="w-5 h-5 text-blue-600" />
              Fishing Log
            </CardTitle>
            <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Fishing Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Lake Tahoe"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="species">Species *</Label>
                    <Input
                      id="species"
                      placeholder="e.g., Bass, Trout"
                      value={formData.species}
                      onChange={(e) => setFormData(prev => ({ ...prev, species: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input
                      id="duration"
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Optional notes about the trip..."
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddingEntry(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1">
                      Save Entry
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entries">Recent Entries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          {entries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Fish className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No fishing entries yet. Add your first catch!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {analytics.recentEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{entry.date}</span>
                        {entry.success && <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {entry.duration > 0 && `${entry.duration}h`}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{entry.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fish className="w-4 h-4 text-gray-500" />
                        <span>{entry.species}</span>
                      </div>
                    </div>
                    {entry.quantity > 0 && (
                      <div className="text-sm text-gray-600">
                        Caught: {entry.quantity} fish
                        {entry.weight > 0 && ` (${entry.weight} lbs)`}
                      </div>
                    )}
                    {entry.notes && (
                      <div className="mt-2 text-sm text-gray-600 italic">
                        "{entry.notes}"
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {entries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Add some fishing entries to see analytics!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Summary Cards */}
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-2xl font-bold">{analytics.totalTrips}</div>
                  <div className="text-sm text-gray-500">Total Trips</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <div className="text-2xl font-bold">{analytics.successfulTrips}</div>
                  <div className="text-sm text-gray-500">Successful Trips</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Fish className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                  <div className="text-2xl font-bold">{analytics.totalCatch}</div>
                  <div className="text-sm text-gray-500">Total Catch</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <div className="text-2xl font-bold">{analytics.totalWeight.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Total Weight (lbs)</div>
                </CardContent>
              </Card>

              {/* Top Species */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Top Species</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.topSpecies.length === 0 ? (
                    <p className="text-gray-500">No catches recorded yet</p>
                  ) : (
                    <div className="space-y-2">
                      {analytics.topSpecies.map((item, index) => (
                        <div key={item.species} className="flex items-center justify-between">
                          <span className="font-medium">#{index + 1} {item.species}</span>
                          <Badge variant="outline">{item.count} caught</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Locations */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Top Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.topLocations.length === 0 ? (
                    <p className="text-gray-500">No locations recorded yet</p>
                  ) : (
                    <div className="space-y-2">
                      {analytics.topLocations.map((item, index) => (
                        <div key={item.location} className="flex items-center justify-between">
                          <span className="font-medium">#{index + 1} {item.location}</span>
                          <Badge variant="outline">{item.visits} visits</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Success Rate */}
              {analytics.totalTrips > 0 && (
                <Card className="md:col-span-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {analytics.successRate.toFixed(1)}%
                      </div>
                      <p className="text-gray-600">
                        {analytics.successfulTrips} successful trips out of {analytics.totalTrips} total trips
                      </p>
                      {analytics.averageDuration > 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                          Average trip duration: {analytics.averageDuration.toFixed(1)} hours
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
