import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  MapPin, 
  List, 
  Users, 
  Clock, 
  Heart, 
  X 
} from "lucide-react";
import { Event } from "@shared/schema";

export default function Events() {
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    sport: "",
    startDate: "",
    endDate: ""
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ["/api/events", searchFilters],
    enabled: true
  });

  const handleSearch = () => {
    // The query will automatically refetch when searchFilters changes
    const newFilters: string[] = [];
    if (searchFilters.sport) newFilters.push(searchFilters.sport);
    if (searchFilters.location) newFilters.push(searchFilters.location);
    setActiveFilters(newFilters);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
    // Reset the corresponding search filter
    if (searchFilters.sport === filter) {
      setSearchFilters({ ...searchFilters, sport: "" });
    }
    if (searchFilters.location === filter) {
      setSearchFilters({ ...searchFilters, location: "" });
    }
  };

  const getSportColor = (sport: string) => {
    const sportColors: Record<string, string> = {
      "Marathon": "bg-athletic-orange/10 text-athletic-orange",
      "Triathlon": "bg-athletic-blue/10 text-athletic-blue", 
      "Cycling": "bg-athletic-green/10 text-athletic-green",
      "Running": "bg-athletic-amber/10 text-athletic-amber"
    };
    return sportColors[sport] || "bg-gray-100 text-gray-600";
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time?: string) => {
    if (!time) return "";
    return time;
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Unable to load events
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please try again later or check your connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Discover Events
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === "map" ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode("map")}
            className={viewMode === "map" ? "bg-athletic-orange hover:bg-athletic-orange/90" : ""}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Map View
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-athletic-orange hover:bg-athletic-orange/90" : ""}
          >
            <List className="mr-2 h-4 w-4" />
            List View
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="location" className="text-sm font-medium mb-1">
                Location
              </Label>
              <Input
                id="location"
                placeholder="City, state, or country"
                value={searchFilters.location}
                onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="sport" className="text-sm font-medium mb-1">
                Sport
              </Label>
              <Select 
                value={searchFilters.sport} 
                onValueChange={(value) => setSearchFilters({ ...searchFilters, sport: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="Running">Running</SelectItem>
                  <SelectItem value="Marathon">Marathon</SelectItem>
                  <SelectItem value="Cycling">Cycling</SelectItem>
                  <SelectItem value="Swimming">Swimming</SelectItem>
                  <SelectItem value="Triathlon">Triathlon</SelectItem>
                  <SelectItem value="Tennis">Tennis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium mb-1">
                Date Range
              </Label>
              <Input
                id="startDate"
                type="date"
                value={searchFilters.startDate}
                onChange={(e) => setSearchFilters({ ...searchFilters, startDate: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                className="w-full bg-athletic-orange hover:bg-athletic-orange/90"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
          
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-athletic-orange/10 text-athletic-orange"
                >
                  {filter}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0 text-athletic-orange/70 hover:text-athletic-orange"
                    onClick={() => removeFilter(filter)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm text-gray-500 hover:text-athletic-orange h-auto p-0"
                onClick={() => {
                  setActiveFilters([]);
                  setSearchFilters({ location: "", sport: "", startDate: "", endDate: "" });
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Results */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : events && events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="overflow-hidden card-hover">
                <img 
                  src={event.imageUrl || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getSportColor(event.sport)}>
                      {event.sport}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(event.startDate)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {event.location}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {event.participants?.toLocaleString()} participants
                      </span>
                      {event.startTime && (
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatTime(event.startTime)} start
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-athletic-orange hover:bg-athletic-orange/90">
                      Register
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search filters or check back later for new events.
              </p>
            </div>
          )}
        </div>
      )}

      {viewMode === "map" && (
        <Card className="h-96">
          <CardContent className="p-6 h-full flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <MapPin className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Map View</h3>
              <p>Interactive map coming soon with event locations and filtering.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {!isLoading && events && events.length > 0 && viewMode === "list" && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            Load More Events
          </Button>
        </div>
      )}
    </div>
  );
}
