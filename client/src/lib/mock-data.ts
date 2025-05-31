export const mockStats = {
  upcomingEvents: 3,
  activeTrips: 1,
  trainingStreak: 12,
  monthlyMiles: 127.3
};

export const mockWeeklyData = {
  distance: 32.5,
  workouts: 5,
  calories: 2847
};

export const mockHealthData = {
  restingHeartRate: 48,
  sleepScore: 87,
  recoveryScore: 72
};

export const mockActivities = [
  {
    id: 1,
    type: "running",
    name: "Morning Run",
    duration: 62,
    distance: 8.2,
    pace: "7:32",
    location: "Central Park",
    calories: 654,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 2,
    type: "strength",
    name: "Strength Training",
    duration: 45,
    distance: null,
    pace: null,
    location: "Boston Athletic Club",
    calories: 320,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
  },
  {
    id: 3,
    type: "swimming",
    name: "Recovery Swim",
    duration: 40,
    distance: 1.24, // 2000m converted to miles
    pace: "2:00/100m",
    location: "Hotel pool",
    calories: 280,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
];

export const mockReminders = [
  {
    id: 1,
    type: "flight",
    title: "Flight check-in",
    message: "Check in for your flight to Boston",
    dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    priority: "high"
  },
  {
    id: 2,
    type: "training",
    title: "Training session",
    message: "Morning run scheduled",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000), // Tomorrow 7 AM
    priority: "medium"
  },
  {
    id: 3,
    type: "registration",
    title: "Event registration",
    message: "NYC Triathlon registration closes soon",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    priority: "medium"
  }
];

export const mockCurrentTrip = {
  id: 1,
  name: "Boston Marathon 2024",
  destination: "Boston, MA",
  startDate: "2024-04-13",
  endDate: "2024-04-17",
  status: "active",
  accommodation: {
    name: "The Athletic Boston",
    pricePerNight: 189,
    nights: 4
  },
  event: {
    name: "Boston Marathon 2024",
    date: "2024-04-15"
  },
  totalCost: 1151
};

export const mockUpcomingEvents = [
  {
    id: 1,
    name: "NYC Triathlon",
    date: "July 23, 2024",
    status: "Registered",
    type: "triathlon"
  },
  {
    id: 2,
    name: "LA Century Ride",
    date: "September 8, 2024",
    status: "Planning",
    type: "cycling"
  }
];

export const mockRecentActivity = [
  {
    type: "training",
    title: "Training session completed",
    description: "8.5 mile run in Central Park",
    time: "2 hours ago",
    icon: "check"
  },
  {
    type: "booking",
    title: "Hotel booking confirmed",
    description: "The Athletic Boston",
    time: "Yesterday",
    icon: "hotel"
  },
  {
    type: "nutrition",
    title: "Nutrition plan updated",
    description: "Marathon week meal prep",
    time: "2 days ago",
    icon: "utensils"
  }
];

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  }
  return `${mins}:00`;
};

export const formatPace = (totalMinutes: number, distance: number): string => {
  const paceMinutes = Math.floor(totalMinutes / distance);
  const paceSeconds = Math.round(((totalMinutes / distance) - paceMinutes) * 60);
  return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 0) {
    return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
  } else if (diffHours > 0) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffMinutes > 0) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  } else {
    return 'Just now';
  }
};
