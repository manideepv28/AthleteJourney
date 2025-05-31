import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Search, 
  Calendar,
  Share,
  Download,
  MapPin,
  DollarSign,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Bike,
  ShirtIcon,
  UtensilsCrossed,
  Star
} from "lucide-react";
import { auth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { apiRequest } from "@/lib/queryClient";
import { Accommodation, TrainingFacility } from "@shared/schema";

interface TripPlanningData {
  name: string;
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  accommodationType: string;
  priceRange: string;
  selectedAccommodation?: Accommodation;
  selectedFacilities: TrainingFacility[];
  dietaryPreference: string;
  mealPlanning: string;
  athleticAmenities: string[];
}

export default function PlanTrip() {
  const { toast } = useToast();
  const currentUser = auth.getCurrentUser();
  
  const [tripData, setTripData] = useState<TripPlanningData>({
    name: "",
    destination: "",
    checkInDate: "",
    checkOutDate: "",
    accommodationType: "",
    priceRange: "",
    selectedFacilities: [],
    dietaryPreference: "",
    mealPlanning: "",
    athleticAmenities: []
  });

  const [accommodationFilters, setAccommodationFilters] = useState({
    city: "",
    type: "",
    maxPrice: undefined as number | undefined
  });

  const [facilityFilters, setFacilityFilters] = useState({
    city: "",
    type: "",
    sports: [] as string[]
  });

  // Fetch accommodations
  const { data: accommodations, isLoading: accommodationsLoading } = useQuery<Accommodation[]>({
    queryKey: ["/api/accommodations", accommodationFilters],
    enabled: !!accommodationFilters.city
  });

  // Fetch training facilities
  const { data: facilities, isLoading: facilitiesLoading } = useQuery<TrainingFacility[]>({
    queryKey: ["/api/training-facilities", facilityFilters],
    enabled: !!facilityFilters.city
  });

  // Save trip mutation
  const saveTrip = useMutation({
    mutationFn: async (tripData: any) => {
      if (!currentUser) throw new Error("User not authenticated");
      
      const tripPayload = {
        userId: currentUser.id,
        name: tripData.name,
        destination: tripData.destination,
        startDate: new Date(tripData.checkInDate),
        endDate: new Date(tripData.checkOutDate),
        accommodation: tripData.selectedAccommodation,
        trainingFacilities: tripData.selectedFacilities,
        nutritionPlan: {
          dietaryPreference: tripData.dietaryPreference,
          mealPlanning: tripData.mealPlanning
        },
        totalCost: calculateTotalCost(),
        status: "planning"
      };

      const response = await apiRequest("POST", "/api/trips", tripPayload);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Trip saved!",
        description: "Your trip has been saved successfully.",
      });
      // Also save to local storage for offline access
      storage.saveTrip(tripData);
    },
    onError: (error) => {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save trip",
        variant: "destructive",
      });
    }
  });

  const handleSearchAccommodations = () => {
    if (!tripData.destination) {
      toast({
        title: "Destination required",
        description: "Please enter a destination first",
        variant: "destructive"
      });
      return;
    }

    setAccommodationFilters({
      city: tripData.destination,
      type: tripData.accommodationType === "any" ? "" : tripData.accommodationType || "",
      maxPrice: tripData.priceRange ? parseFloat(tripData.priceRange) : undefined
    });
  };

  const handleSearchFacilities = () => {
    if (!tripData.destination) {
      toast({
        title: "Destination required",
        description: "Please enter a destination first",
        variant: "destructive"
      });
      return;
    }

    setFacilityFilters({
      city: tripData.destination,
      type: "",
      sports: currentUser?.sport ? [currentUser.sport] : []
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    const current = tripData.athleticAmenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    
    setTripData({ ...tripData, athleticAmenities: updated });
  };

  const selectAccommodation = (accommodation: Accommodation) => {
    setTripData({ ...tripData, selectedAccommodation: accommodation });
  };

  const addFacility = (facility: TrainingFacility) => {
    const current = tripData.selectedFacilities || [];
    if (!current.find(f => f.id === facility.id)) {
      setTripData({ 
        ...tripData, 
        selectedFacilities: [...current, facility] 
      });
    }
  };

  const removeFacility = (facilityId: number) => {
    const current = tripData.selectedFacilities || [];
    setTripData({ 
      ...tripData, 
      selectedFacilities: current.filter(f => f.id !== facilityId) 
    });
  };

  const calculateTotalCost = (): number => {
    let total = 0;
    
    if (tripData.selectedAccommodation && tripData.checkInDate && tripData.checkOutDate) {
      const checkIn = new Date(tripData.checkInDate);
      const checkOut = new Date(tripData.checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      total += tripData.selectedAccommodation.pricePerNight * nights;
    }
    
    if (tripData.selectedFacilities && tripData.checkInDate && tripData.checkOutDate) {
      const checkIn = new Date(tripData.checkInDate);
      const checkOut = new Date(tripData.checkOutDate);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      tripData.selectedFacilities.forEach(facility => {
        total += facility.pricePerDay * days;
      });
    }
    
    return total;
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, any> = {
      "Fitness Center": Dumbbell,
      "Pool": Waves,
      "Bike Storage": Bike,
      "Laundry": ShirtIcon,
      "Early Breakfast": UtensilsCrossed,
      "WiFi": Wifi,
      "Parking": Car
    };
    return icons[amenity] || Dumbbell;
  };

  const exportItinerary = () => {
    const itinerary = {
      trip: tripData,
      accommodation: tripData.selectedAccommodation,
      facilities: tripData.selectedFacilities,
      totalCost: calculateTotalCost()
    };
    
    const dataStr = JSON.stringify(itinerary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tripData.name || 'trip'}-itinerary.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Plan Your Trip
        </h2>
        <Button 
          onClick={() => saveTrip.mutate(tripData)}
          disabled={!tripData.name || !tripData.destination || saveTrip.isPending}
          className="bg-athletic-orange hover:bg-athletic-orange/90"
        >
          <Save className="mr-2 h-4 w-4" />
          {saveTrip.isPending ? "Saving..." : "Save Trip"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trip Planning Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Trip Information */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tripName">Trip Name</Label>
                  <Input
                    id="tripName"
                    placeholder="e.g. Boston Marathon 2024"
                    value={tripData.name}
                    onChange={(e) => setTripData({ ...tripData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="City, State/Country"
                    value={tripData.destination}
                    onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="checkIn">Check-in Date</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={tripData.checkInDate}
                    onChange={(e) => setTripData({ ...tripData, checkInDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out Date</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={tripData.checkOutDate}
                    onChange={(e) => setTripData({ ...tripData, checkOutDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accommodation Search */}
          <Card>
            <CardHeader>
              <CardTitle>Accommodations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="accType">Type</Label>
                  <Select 
                    value={tripData.accommodationType} 
                    onValueChange={(value) => setTripData({ ...tripData, accommodationType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Hotel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="athletic_hotel">Athletic-Friendly Hotel</SelectItem>
                      <SelectItem value="vacation_rental">Vacation Rental</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priceRange">Max Price per Night</Label>
                  <Input
                    id="priceRange"
                    type="number"
                    placeholder="200"
                    value={tripData.priceRange}
                    onChange={(e) => setTripData({ ...tripData, priceRange: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSearchAccommodations}
                    className="w-full bg-athletic-orange hover:bg-athletic-orange/90"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Athletic Amenities Filter */}
              <div className="mb-4">
                <Label className="text-sm font-medium mb-2">Athletic Amenities</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Fitness Center", "Pool", "Bike Storage", "Laundry", "Early Breakfast"].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={tripData.athleticAmenities?.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accommodation Results */}
              <div className="space-y-4">
                {accommodationsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <Skeleton className="w-20 h-16 rounded" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : accommodations && accommodations.length > 0 ? (
                  accommodations.map((accommodation) => (
                    <Card 
                      key={accommodation.id} 
                      className={`cursor-pointer transition-all ${
                        tripData.selectedAccommodation?.id === accommodation.id 
                          ? 'ring-2 ring-athletic-orange border-athletic-orange' 
                          : 'hover:border-athletic-orange'
                      }`}
                      onClick={() => selectAccommodation(accommodation)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <img 
                            src={accommodation.imageUrl || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=80"} 
                            alt={accommodation.name}
                            className="w-20 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {accommodation.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {accommodation.location} • {accommodation.distanceToEvent ? `${accommodation.distanceToEvent} miles from event` : 'Distance not specified'}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              {accommodation.rating && (
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs ml-1">{accommodation.rating}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {accommodation.athleticAmenities?.slice(0, 3).map((amenity, index) => {
                                const Icon = getAmenityIcon(amenity);
                                return (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    <Icon className="h-3 w-3 mr-1" />
                                    {amenity}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              ${accommodation.pricePerNight}/night
                            </p>
                            <Button 
                              size="sm"
                              variant={tripData.selectedAccommodation?.id === accommodation.id ? "default" : "outline"}
                              className={tripData.selectedAccommodation?.id === accommodation.id ? "bg-athletic-orange hover:bg-athletic-orange/90" : ""}
                            >
                              {tripData.selectedAccommodation?.id === accommodation.id ? "Selected" : "Select"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : accommodationFilters.city ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MapPin className="mx-auto h-8 w-8 mb-2" />
                    <p>No accommodations found for this destination.</p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Training Facilities */}
          <Card>
            <CardHeader>
              <CardTitle>Training Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button 
                  onClick={handleSearchFacilities}
                  className="bg-athletic-blue hover:bg-athletic-blue/90"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Find Facilities
                </Button>
              </div>

              <div className="space-y-4">
                {facilitiesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <Skeleton className="w-20 h-16 rounded" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : facilities && facilities.length > 0 ? (
                  facilities.map((facility) => {
                    const isAdded = tripData.selectedFacilities?.some(f => f.id === facility.id);
                    return (
                      <Card key={facility.id} className="hover:border-athletic-blue">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <img 
                              src={facility.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=80"} 
                              alt={facility.name}
                              className="w-20 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {facility.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {facility.location} • {facility.distanceFromAccommodation ? `${facility.distanceFromAccommodation} miles from hotel` : 'Distance not specified'}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {facility.amenities?.slice(0, 3).map((amenity, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${facility.pricePerDay}/day
                              </p>
                              <Button 
                                size="sm"
                                onClick={() => isAdded ? removeFacility(facility.id) : addFacility(facility)}
                                variant={isAdded ? "default" : "outline"}
                                className={isAdded ? "bg-athletic-blue hover:bg-athletic-blue/90" : ""}
                              >
                                {isAdded ? "Added" : "Add"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : facilityFilters.city ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Dumbbell className="mx-auto h-8 w-8 mb-2" />
                    <p>No training facilities found for this destination.</p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Nutrition Planning */}
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="dietary">Dietary Preferences</Label>
                  <Select 
                    value={tripData.dietaryPreference} 
                    onValueChange={(value) => setTripData({ ...tripData, dietaryPreference: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No Restrictions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Restrictions</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="high-protein">High-Protein</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mealPlanning">Meal Planning</Label>
                  <Select 
                    value={tripData.mealPlanning} 
                    onValueChange={(value) => setTripData({ ...tripData, mealPlanning: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Meals" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Meals</SelectItem>
                      <SelectItem value="pre-post-workout">Pre/Post Workout</SelectItem>
                      <SelectItem value="race-day">Race Day Only</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="p-4 bg-athletic-green/5 rounded-lg border border-athletic-green/20">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Recommended Restaurants Nearby
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Sweetgreen - Healthy Bowls
                    </span>
                    <Badge className="bg-athletic-green/10 text-athletic-green text-xs">
                      0.3 mi
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Protein Bar - Pre-Workout
                    </span>
                    <Badge className="bg-athletic-green/10 text-athletic-green text-xs">
                      0.5 mi
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trip Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {tripData.name || "Untitled Trip"}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tripData.destination || "No destination"} 
                    {tripData.checkInDate && tripData.checkOutDate && 
                      ` • ${new Date(tripData.checkInDate).toLocaleDateString()} - ${new Date(tripData.checkOutDate).toLocaleDateString()}`
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  {tripData.selectedAccommodation && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Accommodation</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${tripData.selectedAccommodation.pricePerNight * 
                          (tripData.checkInDate && tripData.checkOutDate ? 
                            Math.ceil((new Date(tripData.checkOutDate).getTime() - new Date(tripData.checkInDate).getTime()) / (1000 * 60 * 60 * 24)) : 1
                          )
                        }
                      </span>
                    </div>
                  )}
                  {tripData.selectedFacilities && tripData.selectedFacilities.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Training Facilities</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${tripData.selectedFacilities.reduce((sum, f) => sum + f.pricePerDay, 0) * 
                          (tripData.checkInDate && tripData.checkOutDate ? 
                            Math.ceil((new Date(tripData.checkOutDate).getTime() - new Date(tripData.checkInDate).getTime()) / (1000 * 60 * 60 * 24)) : 1
                          )
                        }
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">Total</span>
                      <span className="text-lg font-bold text-athletic-orange">
                        ${calculateTotalCost()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4 text-athletic-orange" />
                  Add to Calendar
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Share className="mr-2 h-4 w-4 text-athletic-blue" />
                  Share Itinerary
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={exportItinerary}
                  disabled={!tripData.name}
                >
                  <Download className="mr-2 h-4 w-4 text-athletic-green" />
                  Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
