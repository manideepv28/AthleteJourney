import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Plane, 
  Flame, 
  Activity, 
  Plus,
  CheckCircle,
  Hotel,
  Utensils,
  ExternalLink,
  Medal,
  Bike,
  AlertTriangle,
  Dumbbell,
  CalendarCheck
} from "lucide-react";
import { auth } from "@/lib/auth";
import { mockStats, mockCurrentTrip, mockUpcomingEvents, mockRecentActivity, mockReminders } from "@/lib/mock-data";

export default function Dashboard() {
  const currentUser = auth.getCurrentUser();

  const stats = [
    {
      title: "Upcoming Events",
      value: mockStats.upcomingEvents,
      icon: Calendar,
      color: "text-athletic-orange",
      bgColor: "bg-athletic-orange/10"
    },
    {
      title: "Active Trips", 
      value: mockStats.activeTrips,
      icon: Plane,
      color: "text-athletic-blue",
      bgColor: "bg-athletic-blue/10"
    },
    {
      title: "Training Streak",
      value: `${mockStats.trainingStreak} days`,
      icon: Flame,
      color: "text-athletic-green",
      bgColor: "bg-athletic-green/10"
    },
    {
      title: "Miles This Month",
      value: mockStats.monthlyMiles,
      icon: Activity,
      color: "text-athletic-amber",
      bgColor: "bg-athletic-amber/10"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "training": return CheckCircle;
      case "booking": return Hotel;
      case "nutrition": return Utensils;
      default: return CheckCircle;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "training": return "text-athletic-green";
      case "booking": return "text-athletic-blue";
      case "nutrition": return "text-athletic-orange";
      default: return "text-gray-500";
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "flight": return AlertTriangle;
      case "training": return Dumbbell;
      case "registration": return CalendarCheck;
      default: return AlertTriangle;
    }
  };

  const getReminderColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 border-red-200 text-red-800";
      case "medium": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "low": return "bg-blue-50 border-blue-200 text-blue-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const formatDueTime = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return days === 1 ? "Due in 1 day" : `Due in ${days} days`;
    } else if (hours > 0) {
      return hours === 1 ? "Due in 1 hour" : `Due in ${hours} hours`;
    } else {
      return "Due soon";
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Travel Smart.<br />Train Harder.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Find athlete-friendly accommodations, training facilities, and nutrition options wherever your sport takes you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Search destinations, events, facilities..." 
                className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button 
                size="sm" 
                variant="ghost" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <ExternalLink className="h-5 w-5" />
              </Button>
            </div>
            <Button className="bg-white text-athletic-orange px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Planning
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {currentUser?.fullName.split(' ')[0] || 'Athlete'}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ready for your next athletic adventure?
            </p>
          </div>
          <Button className="bg-athletic-orange hover:bg-athletic-orange/90">
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`${stat.color} text-xl h-6 w-6`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current & Upcoming Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Current Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gradient-to-r from-athletic-orange/5 to-athletic-blue/5">
                <img 
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                  alt="Boston Marathon" 
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {mockCurrentTrip.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {mockCurrentTrip.destination} • Apr 15-17, 2024
                </p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-athletic-green text-white">
                    In Progress
                  </Badge>
                  <Button variant="link" size="sm" className="text-athletic-orange p-0">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUpcomingEvents.map((event, index) => {
                  const Icon = event.type === "triathlon" ? Medal : Bike;
                  const iconColor = event.type === "triathlon" ? "text-athletic-orange" : "text-athletic-blue";
                  const bgColor = event.type === "triathlon" ? "bg-athletic-orange/10" : "bg-athletic-blue/10";
                  const statusColor = event.status === "Registered" ? "text-athletic-amber bg-athletic-amber/10" : "text-gray-500 bg-gray-100";
                  
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`${iconColor} h-5 w-5`} />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {event.name}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.date}
                        </p>
                      </div>
                      <Badge className={statusColor}>
                        {event.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  const iconColor = getActivityColor(activity.type);
                  
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${iconColor.replace('text-', 'bg-')}/10 rounded-full flex items-center justify-center`}>
                        <Icon className={`${iconColor} text-sm h-4 w-4`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {activity.description} • {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockReminders.map((reminder, index) => {
                  const Icon = getReminderIcon(reminder.type);
                  const colorClass = getReminderColor(reminder.priority);
                  
                  return (
                    <div key={index} className={`p-3 border rounded-lg ${colorClass}`}>
                      <div className="flex items-center space-x-2">
                        <Icon className="text-sm h-4 w-4" />
                        <span className="text-sm font-medium">
                          {reminder.title}
                        </span>
                      </div>
                      <p className="text-xs mt-1">
                        {formatDueTime(reminder.dueDate)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
