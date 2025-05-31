import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Dumbbell, Heart, Flame } from "lucide-react";

export function ProgressDashboard() {
  const { user } = useAuth();

  // Mock progress data - in a real app, this would come from the backend
  const progressData = {
    weeklyGoals: {
      running: { current: 15, target: 20, unit: "miles" },
      strength: { current: 4, target: 5, unit: "sessions" },
      recovery: { current: 42, target: 56, unit: "hours" },
    },
    stats: {
      workoutsThisWeek: 12,
      caloriesBurned: 2450,
      restingHR: 52,
      sleepScore: 8.2,
    },
    upcomingWorkouts: [
      { name: "Morning Run", time: "Tomorrow 7:00 AM" },
      { name: "Strength Training", time: "Wed 6:00 PM" },
      { name: "Recovery Swim", time: "Thu 8:00 AM" },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Training Progress</CardTitle>
          <Button variant="outline" size="sm">
            Sync Apps
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Goals */}
        <div className="bg-gradient-athletic rounded-lg p-4 text-white">
          <h4 className="font-semibold mb-3">Weekly Goals</h4>
          <div className="space-y-3">
            {Object.entries(progressData.weeklyGoals).map(([key, goal]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm capitalize">{key}</span>
                  <span className="text-sm font-medium">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                <Progress 
                  value={(goal.current / goal.target) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Dumbbell className="mx-auto h-6 w-6 text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-neutral-dark">
              {progressData.stats.workoutsThisWeek}
            </div>
            <div className="text-sm text-gray-600">Workouts</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Flame className="mx-auto h-6 w-6 text-orange-500 mb-2" />
            <div className="text-2xl font-bold text-neutral-dark">
              {progressData.stats.caloriesBurned.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Calories</div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <Heart className="mx-auto h-6 w-6 text-red-500 mb-2" />
            <div className="text-lg font-bold text-neutral-dark">
              {progressData.stats.restingHR} BPM
            </div>
            <div className="text-xs text-gray-600">Resting HR</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <span className="block text-purple-500 text-xl mb-2">😴</span>
            <div className="text-lg font-bold text-neutral-dark">
              {progressData.stats.sleepScore}/10
            </div>
            <div className="text-xs text-gray-600">Sleep Score</div>
          </div>
        </div>

        {/* Upcoming Workouts */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-neutral-dark mb-3 flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming Workouts
          </h4>
          <div className="space-y-2">
            {progressData.upcomingWorkouts.map((workout, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="font-medium">{workout.name}</span>
                <span className="text-gray-500">{workout.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button size="sm" className="w-full bg-success-green hover:bg-green-700 text-white">
            Log Workout
          </Button>
          <Button size="sm" variant="outline" className="w-full">
            View Full Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
