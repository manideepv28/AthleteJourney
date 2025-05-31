import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Search, Calendar, MapPin, Users, DollarSign } from "lucide-react";
import type { Event } from "@shared/schema";

export function EventSearch() {
  const [filters, setFilters] = useState({
    sport: "",
    location: "",
    date: "",
    difficulty: "",
  });
  const { toast } = useToast();

  const { data: events = [], isLoading, refetch } = useQuery<Event[]>({
    queryKey: ["/api/events", filters],
    enabled: false, // Only fetch when search is triggered
  });

  const handleSearch = () => {
    refetch();
    toast({
      title: "Searching events...",
      description: "Finding events that match your criteria.",
    });
  };

  const resetFilters = () => {
    setFilters({
      sport: "",
      location: "",
      date: "",
      difficulty: "",
    });
  };

  const getSportBadgeColor = (sport: string) => {
    const colors = {
      "Running": "bg-red-100 text-red-800",
      "Cycling": "bg-green-100 text-green-800",
      "Swimming": "bg-blue-100 text-blue-800",
      "Triathlon": "bg-purple-100 text-purple-800",
      "CrossFit": "bg-orange-100 text-orange-800",
    };
    return colors[sport as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      "Beginner": "bg-green-100 text-green-800",
      "Intermediate": "bg-yellow-100 text-yellow-800",
      "Advanced": "bg-orange-100 text-orange-800",
      "Expert": "bg-red-100 text-red-800",
      "Elite": "bg-purple-100 text-purple-800",
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-2 h-5 w-5" />
          Find Your Next Event
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sport">Sport Type</Label>
            <Select value={filters.sport} onValueChange={(value) => setFilters(prev => ({ ...prev, sport: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="Running">Running</SelectItem>
                <SelectItem value="Cycling">Cycling</SelectItem>
                <SelectItem value="Swimming">Swimming</SelectItem>
                <SelectItem value="Triathlon">Triathlon</SelectItem>
                <SelectItem value="CrossFit">CrossFit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, State, or Country"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="date">Date Range</Label>
            <Input
              id="date"
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Any Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Level</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
                <SelectItem value="Elite">Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Actions */}
        <div className="flex gap-2">
          <Button onClick={handleSearch} className="bg-primary hover:bg-blue-700 flex-1">
            <Search className="mr-2 h-4 w-4" />
            Search Events
          </Button>
          <Button variant="outline" onClick={resetFilters}>
            Clear
          </Button>
        </div>

        {/* Search Results */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            ))}
          </div>
        )}

        {events.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Search Results ({events.length} events)</h3>
            <div className="grid gap-4">
              {events.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{event.title}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="mr-1 h-3 w-3" />
                        {event.location}
                        <Calendar className="ml-3 mr-1 h-3 w-3" />
                        {event.date ? new Date(event.date).toLocaleDateString() : "TBD"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        ${event.price}
                      </div>
                      {event.capacity && event.registered && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {event.registered}/{event.capacity}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge className={getSportBadgeColor(event.sport)}>
                        {event.sport}
                      </Badge>
                      {event.difficulty && (
                        <Badge className={getDifficultyColor(event.difficulty)}>
                          {event.difficulty}
                        </Badge>
                      )}
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-blue-700">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && events.length === 0 && filters.sport && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p>Try adjusting your search criteria to find more events.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
