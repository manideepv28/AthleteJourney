import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Star } from "lucide-react";
import type { TrainingFacility } from "@shared/schema";

export function TrainingFacilities() {
  const { data: facilities = [], isLoading } = useQuery<TrainingFacility[]>({
    queryKey: ["/api/training-facilities"],
  });

  const getStatusColor = (status: string) => {
    const colors = {
      "open": "bg-green-100 text-green-800",
      "busy": "bg-yellow-100 text-yellow-800",
      "closed": "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts = {
      "open": "Open",
      "busy": "Busy",
      "closed": "Closed",
    };
    return texts[status as keyof typeof texts] || "Unknown";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nearby Training Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-1/4" />
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
        <CardTitle>Nearby Training Facilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {facilities.map((facility) => (
            <div key={facility.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-neutral-dark">{facility.name}</h4>
                <Badge className={getStatusColor(facility.status || "open")}>
                  {getStatusText(facility.status || "open")}
                </Badge>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="mr-1 h-3 w-3" />
                {facility.distance} • {facility.type}
                {facility.rating && (
                  <>
                    <Star className="ml-2 mr-1 h-3 w-3 text-yellow-400 fill-current" />
                    {(facility.rating / 10).toFixed(1)}
                  </>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3 text-xs">
                {facility.amenities && (facility.amenities as string[]).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  {facility.price && (
                    <span className="text-sm font-medium text-energy-orange">
                      ${facility.price}/day pass
                    </span>
                  )}
                  {facility.hours && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="mr-1 h-3 w-3" />
                      Open today
                    </div>
                  )}
                </div>
                <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                  {facility.status === "open" ? "Reserve" : "Check Schedule"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
