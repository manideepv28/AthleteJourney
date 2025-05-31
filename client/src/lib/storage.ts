class LocalStorageManager {
  private prefix = 'athletetravel_';
  
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }
  
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
  
  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }
  
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
  
  // Trip-specific methods
  saveTrip(trip: any): void {
    const trips = this.get<any[]>('trips') || [];
    const existingIndex = trips.findIndex(t => t.id === trip.id);
    
    if (existingIndex >= 0) {
      trips[existingIndex] = trip;
    } else {
      trips.push({ ...trip, id: Date.now() });
    }
    
    this.set('trips', trips);
  }
  
  getTrips(): any[] {
    return this.get<any[]>('trips') || [];
  }
  
  // Preferences
  savePreferences(prefs: any): void {
    this.set('preferences', prefs);
  }
  
  getPreferences(): any {
    return this.get('preferences') || {
      dietaryRestrictions: [],
      preferredSports: [],
      budgetRange: { min: 0, max: 1000 },
      notifications: true
    };
  }
  
  // Search history
  addSearchHistory(search: string): void {
    const history = this.get<string[]>('search_history') || [];
    const filtered = history.filter(h => h !== search);
    filtered.unshift(search);
    this.set('search_history', filtered.slice(0, 10)); // Keep last 10 searches
  }
  
  getSearchHistory(): string[] {
    return this.get<string[]>('search_history') || [];
  }
}

export const storage = new LocalStorageManager();
