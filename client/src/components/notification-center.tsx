import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Plane, TriangleAlert, Settings } from "lucide-react";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "deadline",
      title: "Registration Deadline",
      message: "Boston Triathlon registration closes in 3 days",
      priority: "high",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isRead: false,
    },
    {
      id: 2,
      type: "travel",
      title: "Travel Booking",
      message: "Book your flight to NYC - prices increase in 5 days",
      priority: "medium",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isRead: false,
    },
    {
      id: 3,
      type: "training",
      title: "Training Reminder",
      message: "Tomorrow: Long run - 12 miles at 7:00 AM",
      priority: "medium",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: 4,
      type: "nutrition",
      title: "Meal Prep",
      message: "Prepare race-day nutrition plan",
      priority: "low",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isRead: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    const icons = {
      deadline: TriangleAlert,
      travel: Plane,
      training: Calendar,
      nutrition: "🍎",
    };
    const Icon = icons[type as keyof typeof icons];
    return typeof Icon === "string" ? Icon : Icon ? <Icon className="h-4 w-4" /> : <Bell className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "border-l-red-500 bg-red-50",
      medium: "border-l-blue-500 bg-blue-50",
      low: "border-l-green-500 bg-green-50",
    };
    return colors[priority as keyof typeof colors] || "border-l-gray-300 bg-gray-50";
  };

  const getPriorityBadgeColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-blue-100 text-blue-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'}`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else {
      return "Soon";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Reminders & Alerts
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-l-4 p-3 rounded-r-lg cursor-pointer transition-opacity ${
                getPriorityColor(notification.priority)
              } ${notification.isRead ? 'opacity-60' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <h4 className="font-semibold text-sm">
                    {notification.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityBadgeColor(notification.priority)} size="sm">
                    {notification.priority}
                  </Badge>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-2">
                {notification.message}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatTimeRemaining(notification.dueDate)} remaining
                </span>
                <span className="text-primary font-medium">
                  {notification.type === "training" ? "View Schedule" : 
                   notification.type === "travel" ? "Book Now" :
                   notification.type === "deadline" ? "Register" : "Action"}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-4 border-t mt-4">
          <Button variant="link" size="sm" className="text-primary hover:text-blue-700">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
