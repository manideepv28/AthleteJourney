// Local storage utilities for athlete travel data

interface AthleteUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  sport?: string;
  level?: string;
  goals?: any;
  preferences?: any;
}

interface Trip {
  id: number;
  userId: number;
  eventId: number;
  accommodationId?: number;
  startDate: string;
  endDate: string;
  status: string;
  itinerary?: any;
  notes?: string;
}

interface ProgressEntry {
  id: number;
  userId: number;
  date: string;
  workoutType?: string;
  duration?: number;
  distance?: number;
  calories?: number;
  notes?: string;
  metrics?: any;
}

interface Reminder {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  dueDate?: string;
  isCompleted: boolean;
  priority: string;
}

const STORAGE_KEYS = {
  USER: 'athleteTravel_user',
  TRIPS: 'athleteTravel_trips',
  PROGRESS: 'athleteTravel_progress',
  REMINDERS: 'athleteTravel_reminders',
  PREFERENCES: 'athleteTravel_preferences',
  SEARCH_HISTORY: 'athleteTravel_searchHistory',
} as const;

// User management
export const userStorage = {
  get(): AthleteUser | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  set(user: AthleteUser): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  update(updates: Partial<AthleteUser>): AthleteUser | null {
    const user = this.get();
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    this.set(updatedUser);
    return updatedUser;
  },
};

// Trip management
export const tripStorage = {
  getAll(userId: number): Trip[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
    const trips: Trip[] = data ? JSON.parse(data) : [];
    return trips.filter(trip => trip.userId === userId);
  },

  add(trip: Omit<Trip, 'id'>): Trip {
    const trips = this.getAllTrips();
    const newTrip: Trip = {
      ...trip,
      id: Date.now(), // Simple ID generation
    };
    trips.push(newTrip);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    return newTrip;
  },

  update(id: number, updates: Partial<Trip>): Trip | null {
    const trips = this.getAllTrips();
    const index = trips.findIndex(trip => trip.id === id);
    if (index === -1) return null;

    trips[index] = { ...trips[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    return trips[index];
  },

  delete(id: number): boolean {
    const trips = this.getAllTrips();
    const filteredTrips = trips.filter(trip => trip.id !== id);
    if (filteredTrips.length === trips.length) return false;

    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(filteredTrips));
    return true;
  },

  getAllTrips(): Trip[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return data ? JSON.parse(data) : [];
  },
};

// Progress tracking
export const progressStorage = {
  getAll(userId: number): ProgressEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    const entries: ProgressEntry[] = data ? JSON.parse(data) : [];
    return entries.filter(entry => entry.userId === userId);
  },

  add(entry: Omit<ProgressEntry, 'id'>): ProgressEntry {
    const entries = this.getAllEntries();
    const newEntry: ProgressEntry = {
      ...entry,
      id: Date.now(),
      date: entry.date || new Date().toISOString(),
    };
    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(entries));
    return newEntry;
  },

  getWeeklyStats(userId: number): any {
    const entries = this.getAll(userId);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyEntries = entries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    );

    return {
      totalWorkouts: weeklyEntries.length,
      totalCalories: weeklyEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0),
      totalDistance: weeklyEntries.reduce((sum, entry) => sum + (entry.distance || 0), 0),
      totalDuration: weeklyEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0),
    };
  },

  getAllEntries(): ProgressEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : [];
  },
};

// Reminder management
export const reminderStorage = {
  getAll(userId: number): Reminder[] {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    const reminders: Reminder[] = data ? JSON.parse(data) : [];
    return reminders.filter(reminder => reminder.userId === userId);
  },

  add(reminder: Omit<Reminder, 'id'>): Reminder {
    const reminders = this.getAllReminders();
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now(),
    };
    reminders.push(newReminder);
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    return newReminder;
  },

  update(id: number, updates: Partial<Reminder>): Reminder | null {
    const reminders = this.getAllReminders();
    const index = reminders.findIndex(reminder => reminder.id === id);
    if (index === -1) return null;

    reminders[index] = { ...reminders[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    return reminders[index];
  },

  markCompleted(id: number): boolean {
    return this.update(id, { isCompleted: true }) !== null;
  },

  getUpcoming(userId: number): Reminder[] {
    const reminders = this.getAll(userId);
    const now = new Date();
    return reminders
      .filter(reminder => !reminder.isCompleted && reminder.dueDate)
      .filter(reminder => new Date(reminder.dueDate!) > now)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  },

  getAllReminders(): Reminder[] {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return data ? JSON.parse(data) : [];
  },
};

// Preferences management
export const preferencesStorage = {
  get(): any {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : {
      theme: 'light',
      notifications: true,
      units: 'metric',
      language: 'en',
    };
  },

  set(preferences: any): void {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  },

  update(updates: any): any {
    const current = this.get();
    const updated = { ...current, ...updates };
    this.set(updated);
    return updated;
  },
};

// Search history
export const searchHistoryStorage = {
  get(): string[] {
    const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return data ? JSON.parse(data) : [];
  },

  add(query: string): void {
    const history = this.get();
    const filtered = history.filter(item => item !== query);
    filtered.unshift(query);
    const limited = filtered.slice(0, 10); // Keep only last 10 searches
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(limited));
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  },
};

// Clear all data
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Export data for backup
export const exportData = (): string => {
  const data = {
    user: userStorage.get(),
    trips: localStorage.getItem(STORAGE_KEYS.TRIPS),
    progress: localStorage.getItem(STORAGE_KEYS.PROGRESS),
    reminders: localStorage.getItem(STORAGE_KEYS.REMINDERS),
    preferences: preferencesStorage.get(),
    searchHistory: searchHistoryStorage.get(),
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
};

// Import data from backup
export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.user) userStorage.set(data.user);
    if (data.trips) localStorage.setItem(STORAGE_KEYS.TRIPS, data.trips);
    if (data.progress) localStorage.setItem(STORAGE_KEYS.PROGRESS, data.progress);
    if (data.reminders) localStorage.setItem(STORAGE_KEYS.REMINDERS, data.reminders);
    if (data.preferences) preferencesStorage.set(data.preferences);
    if (data.searchHistory) localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(data.searchHistory));
    
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};
