import { Navigation } from "@/components/navigation";
import { EventSearch } from "@/components/event-search";
import { AccommodationGrid } from "@/components/accommodation-grid";
import { TrainingFacilities } from "@/components/training-facilities";
import { ProgressDashboard } from "@/components/progress-dashboard";
import { NutritionRecommendations } from "@/components/nutrition-recommendations";
import { NotificationCenter } from "@/components/notification-center";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Route, Plus } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="gradient-athletic rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName || 'Athlete'}!
              </h1>
              <p className="text-blue-100 mb-4">Ready to plan your next athletic adventure?</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Trophy className="mr-2 h-4 w-4" />
                  <span><strong>12</strong> Events Completed</span>
                </div>
                <div className="flex items-center">
                  <Route className="mr-2 h-4 w-4" />
                  <span><strong>8</strong> Trips Planned</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span><strong>3</strong> Upcoming Events</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-white text-primary hover:bg-blue-50">
                <Plus className="mr-2 h-4 w-4" />
                Plan New Trip
              </Button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Event Search - Takes 2 columns */}
          <div className="lg:col-span-2">
            <EventSearch />
          </div>
          
          {/* Notification Center */}
          <div>
            <NotificationCenter />
          </div>
        </div>

        {/* Accommodations */}
        <div className="mb-8">
          <AccommodationGrid />
        </div>

        {/* Training & Progress Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrainingFacilities />
          <ProgressDashboard />
        </div>

        {/* Nutrition Recommendations */}
        <div className="mb-8">
          <NutritionRecommendations />
        </div>
      </main>
    </div>
  );
}
