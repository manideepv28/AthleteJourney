import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Wifi, Dumbbell, Utensils, Car } from "lucide-react";
import type { Accommodation } from "@shared/schema";

export function AccommodationGrid() {
  const { data: accommodations = [], isLoading } = useQuery<Accommodation[]>({
    queryKey: ["/api/accommodations"],
  });

  const getAmenityIcon = (amenity: string) => {
    const icons = {
      "Gym": Dumbbell,
      "Pool": "🏊‍♂️",
      "Nutrition": Utensils,
      "WiFi": Wifi,
      "Parking": Car,
      "Spa": "🧘‍♀️",
      "Track": "🏃‍♂️",
      "Recovery": "💆‍♂️",
    };
    const Icon = icons[amenity as keyof typeof icons];
    return typeof Icon === "string" ? Icon : Icon ? <Icon className="h-3 w-3" /> : null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Athlete-Friendly Accommodations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Athlete-Friendly Accommodations</CardTitle>
          <Button variant="outline">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((accommodation) => (
            <div key={accommodation.id} className="border border-gray-200 rounded-xl overflow-hidden card-hover cursor-pointer">
              <img 
                src={accommodation.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945"} 
                alt={accommodation.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-neutral-dark">{accommodation.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {accommodation.rating ? (accommodation.rating / 10).toFixed(1) : "N/A"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="mr-1 h-3 w-3" />
                  {accommodation.location}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {accommodation.amenities && (accommodation.amenities as string[]).slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {getAmenityIcon(amenity)}
                      <span className="ml-1">{amenity}</span>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-neutral-dark">
                    ${accommodation.price}
                    <span className="text-sm font-normal text-gray-500">/night</span>
                  </span>
                  <Button size="sm" className="bg-primary hover:bg-blue-700">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
