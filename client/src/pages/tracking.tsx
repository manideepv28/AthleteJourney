import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  RefreshCw, 
  Download, 
  Activity, 
  Heart, 
  Moon, 
  RotateCcw, 
  Target,
  TrendingUp,
  Clock,
  MapPin,
  Zap,
  Award
} from "lucide-react";
import { auth } from "@/lib/auth";
import { mockWeeklyData, mockHealthData, mockActivities, formatDuration, formatTimeAgo } from "@/lib/mock-data";
import { queryClient } from "@/lib/queryClient";
import { HealthMetrics, Activity as ActivityType } from "@shared/schema";

export default function Tracking() {
  const { toast } = useToast();
  const currentUser = auth.getCurrentUser();
  
  const [syncingApps, setSyncingApps] = useState(false);

  // Fetch user health metrics
  const { data: healthMetrics, isLoading: healthLoading } = useQuery<HealthMetrics[]>({
    queryKey: ["/api/health-metrics/user", currentUser?.id],
    enabled: !!currentUser?.id
  });

  // Fetch user activities
  const { data: activities, isLoading: activitiesLoading } = useQuery<ActivityType[]>({
    queryKey: ["/api/activities/user", currentUser?.id],
    enabled: !!currentUser?.id
  });

  // Sync apps mutation
  const syncApps = useMutation({
    mutationFn: async () => {
      // Simulate syncing with fitness apps
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Apps synced!",
        description: "Your fitness data has been updated.",
      });
      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics/user", currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities/user", currentUser?.id] });
    },
    onError: () => {
      toast({
        title: "Sync failed",
        description: "Unable to sync with fitness apps. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSyncApps = async () => {
    setSyncingApps(true);
    await syncApps.mutateAsync();
    setSyncingApps(false);
  };

  const exportData = () => {
    const data = {
      healthMetrics: healthMetrics || [],
      activities: activities || [],
      weeklyStats: mockWeeklyData,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `athlete-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your fitness data has been downloaded.",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "running": return Activity;
      case "strength": return Award;
      case "swimming": return Activity;
      case "cycling": return Activity;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "running": return "text-athletic-orange";
      case "strength": return "text-athletic-blue";
      case "swimming": return "text-athletic-green";
      case "cycling": return "text-athletic-amber";
      default: return "text-gray-500";
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "running": return "bg-athletic-orange/10";
      case "strength": return "bg-athletic-blue/10";
      case "swimming": return "bg-athletic-green/10";
      case "cycling": return "bg-athletic-amber/10";
      default: return "bg-gray-100";
    }
  };

  const currentHealthMetrics = healthMetrics?.[0] || {
    restingHeartRate: mockHealthData.restingHeartRate,
    sleepScore: mockHealthData.sleepScore,
    recoveryScore: mockHealthData.recoveryScore
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Progress & Health Tracking
        </h2>
        <div className="flex space-x-2">
          <Button 
            onClick={handleSyncApps}
            disabled={syncingApps}
            className="bg-athletic-blue hover:bg-athletic-blue/90"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${syncingApps ? 'animate-spin' : ''}`} />
            {syncingApps ? "Syncing..." : "Sync Apps"}
          </Button>
          <Button 
            variant="outline"
            onClick={exportData}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-athletic-orange">
                    {mockWeeklyData.distance}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Miles</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-athletic-blue">
                    {mockWeeklyData.workouts}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Workouts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-athletic-green">
                    {mockWeeklyData.calories.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
                </div>
              </div>
              
              {/* Chart Placeholder */}
              <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <TrendingUp className="mx-auto h-12 w-12 mb-4" />
                  <p className="font-medium">Weekly Performance Chart</p>
                  <p className="text-sm">Training intensity and volume over time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activitiesLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))
                ) : activities && activities.length > 0 ? (
                  activities.slice(0, 5).map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const iconColor = getActivityColor(activity.type);
                    const bgColor = getActivityBgColor(activity.type);
                    
                    return (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`${iconColor} h-6 w-6`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {activity.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.distance && `${activity.distance} miles`}
                            {activity.pace && ` • ${activity.pace} avg pace`}
                            {activity.location && ` • ${activity.location}`}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(activity.date || new Date())}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.duration ? formatDuration(activity.duration) : "--"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Fallback to mock data for demo
                  mockActivities.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const iconColor = getActivityColor(activity.type);
                    const bgColor = getActivityBgColor(activity.type);
                    
                    return (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`${iconColor} h-6 w-6`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {activity.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.distance && `${activity.distance} miles`}
                            {activity.pace && ` • ${activity.pace} avg pace`}
                            {activity.location && ` • ${activity.location}`}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(activity.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDuration(activity.duration)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Metrics Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                      <Heart className="mr-1 h-4 w-4" />
                      Resting Heart Rate
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentHealthMetrics.restingHeartRate || 48} bpm
                    </span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-athletic-green mt-1">Excellent</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                      <Moon className="mr-1 h-4 w-4" />
                      Sleep Quality
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentHealthMetrics.sleepScore || 87}%
                    </span>
                  </div>
                  <Progress value={currentHealthMetrics.sleepScore || 87} className="h-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">7h 24m last night</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                      <RotateCcw className="mr-1 h-4 w-4" />
                      Recovery Score
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentHealthMetrics.recoveryScore || 72}%
                    </span>
                  </div>
                  <Progress value={currentHealthMetrics.recoveryScore || 72} className="h-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ready for medium intensity</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Goals Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      <Target className="mr-1 h-4 w-4" />
                      Weekly Miles
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {mockWeeklyData.distance} / 40
                    </span>
                  </div>
                  <Progress value={81} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Marathon Goal Pace
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">7:20 / 7:30</span>
                  </div>
                  <Progress value={94} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      <Zap className="mr-1 h-4 w-4" />
                      Strength Sessions
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">2 / 3</span>
                  </div>
                  <Progress value={67} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Apps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Strava</span>
                  </div>
                  <Badge className="bg-athletic-green/10 text-athletic-green">Connected</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">MyFitnessPal</span>
                  </div>
                  <Badge className="bg-athletic-green/10 text-athletic-green">Connected</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                      <Moon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Sleep Cycle</span>
                  </div>
                  <Button size="sm" variant="outline" className="text-athletic-orange border-athletic-orange hover:bg-athletic-orange hover:text-white">
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
