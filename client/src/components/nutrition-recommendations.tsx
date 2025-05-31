import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Utensils, MapPin } from "lucide-react";

export function NutritionRecommendations() {
  const nutritionOptions = [
    {
      id: 1,
      name: "Pre-Race Meal Plan",
      type: "meal_plan",
      description: "High-carb, moderate protein for endurance events",
      duration: "3 days",
      meals: 9,
      calories: 2200,
      isBookmarked: true,
      category: "Pre-Event",
    },
    {
      id: 2,
      name: "Recovery Smoothie Bar",
      type: "restaurant",
      description: "Protein smoothies, supplements",
      distance: "0.4 miles",
      rating: 4.7,
      reviews: 124,
      status: "Open Now",
      category: "Recovery",
    },
    {
      id: 3,
      name: "Athlete's Kitchen",
      type: "restaurant",
      description: "Healthy meal prep, sports nutrition",
      distance: "1.1 miles",
      rating: 4.9,
      reviews: 89,
      status: "Open",
      category: "Meal Prep",
    },
    {
      id: 4,
      name: "Hydration Strategy",
      type: "plan",
      description: "Optimal fluid intake for training and competition",
      duration: "Ongoing",
      category: "Hydration",
    },
    {
      id: 5,
      name: "Post-Workout Nutrition",
      type: "meal_plan",
      description: "Recovery meals within 30-minute window",
      duration: "Daily",
      meals: 3,
      calories: 800,
      category: "Recovery",
    },
    {
      id: 6,
      name: "Sports Cafe Downtown",
      type: "restaurant",
      description: "Athletes' favorite spot with performance meals",
      distance: "0.8 miles",
      rating: 4.6,
      reviews: 203,
      status: "Open",
      category: "Performance",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Pre-Event": "bg-blue-100 text-blue-800",
      "Recovery": "bg-green-100 text-green-800",
      "Performance": "bg-purple-100 text-purple-800",
      "Meal Prep": "bg-orange-100 text-orange-800",
      "Hydration": "bg-cyan-100 text-cyan-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Utensils className="mr-2 h-5 w-5" />
            Nutrition Options
          </CardTitle>
          <Button variant="outline">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nutritionOptions.map((option) => (
            <div key={option.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-neutral-dark">{option.name}</h4>
                <div className="flex items-center space-x-1">
                  {option.isBookmarked && (
                    <span className="text-energy-orange">⭐</span>
                  )}
                  {option.type === "restaurant" && option.status === "Open Now" && (
                    <Badge className="bg-success-green text-white text-xs">
                      {option.status}
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{option.description}</p>
              
              <div className="space-y-2 mb-3">
                {option.type === "meal_plan" && (
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {option.duration}
                    </span>
                    {option.meals && (
                      <span className="flex items-center">
                        <Utensils className="mr-1 h-3 w-3" />
                        {option.meals} meals
                      </span>
                    )}
                    {option.calories && (
                      <span className="flex items-center">
                        <span className="mr-1">🔥</span>
                        {option.calories} cal/day
                      </span>
                    )}
                  </div>
                )}
                
                {option.type === "restaurant" && (
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {option.distance}
                    </span>
                    {option.rating && option.reviews && (
                      <span className="flex items-center">
                        <Star className="mr-1 h-3 w-3 text-yellow-400 fill-current" />
                        {option.rating} ({option.reviews})
                      </span>
                    )}
                  </div>
                )}
                
                {option.type === "plan" && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {option.duration}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(option.category)}>
                  {option.category}
                </Badge>
                <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                  {option.type === "restaurant" ? "Order Now" : "View Details"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
