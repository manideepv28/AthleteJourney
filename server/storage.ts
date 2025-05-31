import { 
  users, events, trips, accommodations, trainingFacilities, 
  healthMetrics, activities, reminders,
  type User, type InsertUser, type Event, type InsertEvent,
  type Trip, type InsertTrip, type Accommodation, type InsertAccommodation,
  type TrainingFacility, type InsertTrainingFacility,
  type HealthMetrics, type InsertHealthMetrics,
  type Activity, type InsertActivity,
  type Reminder, type InsertReminder
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Event methods
  getEvents(filters?: { sport?: string; location?: string; startDate?: string; endDate?: string }): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Trip methods
  getUserTrips(userId: number): Promise<Trip[]>;
  getTrip(id: number): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, updates: Partial<Trip>): Promise<Trip | undefined>;

  // Accommodation methods
  getAccommodations(filters?: { city?: string; type?: string; maxPrice?: number }): Promise<Accommodation[]>;
  getAccommodation(id: number): Promise<Accommodation | undefined>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;

  // Training facility methods
  getTrainingFacilities(filters?: { city?: string; type?: string; sports?: string[] }): Promise<TrainingFacility[]>;
  getTrainingFacility(id: number): Promise<TrainingFacility | undefined>;
  createTrainingFacility(facility: InsertTrainingFacility): Promise<TrainingFacility>;

  // Health metrics methods
  getUserHealthMetrics(userId: number, limit?: number): Promise<HealthMetrics[]>;
  createHealthMetrics(metrics: InsertHealthMetrics): Promise<HealthMetrics>;

  // Activity methods
  getUserActivities(userId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Reminder methods
  getUserReminders(userId: number): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, updates: Partial<Reminder>): Promise<Reminder | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private events: Map<number, Event> = new Map();
  private trips: Map<number, Trip> = new Map();
  private accommodations: Map<number, Accommodation> = new Map();
  private trainingFacilities: Map<number, TrainingFacility> = new Map();
  private healthMetrics: Map<number, HealthMetrics> = new Map();
  private activities: Map<number, Activity> = new Map();
  private reminders: Map<number, Reminder> = new Map();
  
  private currentId: number = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed events
    const eventData: Omit<Event, 'id' | 'createdAt'>[] = [
      {
        name: "Boston Marathon 2024",
        sport: "Marathon",
        location: "Boston, Massachusetts",
        city: "Boston",
        state: "MA",
        country: "USA",
        startDate: new Date("2024-04-15T06:00:00Z"),
        endDate: new Date("2024-04-15T14:00:00Z"),
        participants: 30000,
        startTime: "6:00 AM",
        registrationFee: 295,
        description: "The world's oldest annual marathon",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        amenities: ["Bag check", "Medical support", "Hydration stations"]
      },
      {
        name: "NYC Triathlon",
        sport: "Triathlon",
        location: "New York City, New York",
        city: "New York",
        state: "NY",
        country: "USA",
        startDate: new Date("2024-07-23T05:30:00Z"),
        endDate: new Date("2024-07-23T12:00:00Z"),
        participants: 4500,
        startTime: "5:30 AM",
        registrationFee: 450,
        description: "Swim, bike, run through NYC",
        imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        amenities: ["Transition area", "Bike support", "Recovery area"]
      },
      {
        name: "LA Century Ride",
        sport: "Cycling",
        location: "Los Angeles, California",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        startDate: new Date("2024-09-08T07:00:00Z"),
        endDate: new Date("2024-09-08T15:00:00Z"),
        participants: 2200,
        startTime: "7:00 AM",
        registrationFee: 125,
        description: "100-mile coastal ride",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        amenities: ["Rest stops", "Mechanical support", "Finish line festival"]
      }
    ];

    eventData.forEach((event, index) => {
      this.events.set(index + 1, { ...event, id: index + 1, createdAt: new Date() });
    });

    // Seed accommodations
    const accommodationData: Omit<Accommodation, 'id' | 'createdAt'>[] = [
      {
        name: "The Athletic Boston",
        type: "athletic_hotel",
        location: "Downtown Boston",
        city: "Boston",
        pricePerNight: 189,
        rating: 4.5,
        amenities: ["WiFi", "Parking", "Room service"],
        athleticAmenities: ["Fitness Center", "Pool", "Early Breakfast", "Bike Storage"],
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        description: "Athlete-focused hotel in downtown Boston",
        distanceToEvent: 0.5
      },
      {
        name: "Runner's Lodge NYC",
        type: "athletic_hotel",
        location: "Manhattan",
        city: "New York",
        pricePerNight: 225,
        rating: 4.7,
        amenities: ["WiFi", "Concierge", "Restaurant"],
        athleticAmenities: ["Fitness Center", "Recovery Room", "Nutrition Bar", "Laundry"],
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        description: "Premium athletic accommodations in Manhattan",
        distanceToEvent: 0.8
      }
    ];

    accommodationData.forEach((accommodation, index) => {
      this.accommodations.set(index + 1, { ...accommodation, id: index + 1, createdAt: new Date() });
    });

    // Seed training facilities
    const facilityData: Omit<TrainingFacility, 'id' | 'createdAt'>[] = [
      {
        name: "Boston Athletic Club",
        type: "gym",
        location: "Back Bay",
        city: "Boston",
        pricePerDay: 25,
        rating: 4.6,
        amenities: ["Indoor Track", "Pool", "Recovery Center", "Locker rooms"],
        sports: ["Running", "Swimming", "Strength Training"],
        imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        description: "Full-service athletic club with indoor track",
        distanceFromAccommodation: 1.2
      },
      {
        name: "Manhattan Fitness Center",
        type: "gym",
        location: "Midtown",
        city: "New York",
        pricePerDay: 35,
        rating: 4.4,
        amenities: ["Pool", "Spa", "Personal Training", "Group Classes"],
        sports: ["Swimming", "Triathlon Training", "Strength Training"],
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        description: "Premium fitness facility in Manhattan",
        distanceFromAccommodation: 0.6
      }
    ];

    facilityData.forEach((facility, index) => {
      this.trainingFacilities.set(index + 1, { ...facility, id: index + 1, createdAt: new Date() });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      isAuthenticated: true,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Event methods
  async getEvents(filters?: { sport?: string; location?: string; startDate?: string; endDate?: string }): Promise<Event[]> {
    let events = Array.from(this.events.values());
    
    if (filters) {
      if (filters.sport) {
        events = events.filter(event => 
          event.sport.toLowerCase().includes(filters.sport!.toLowerCase())
        );
      }
      if (filters.location) {
        events = events.filter(event => 
          event.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.startDate) {
        const filterDate = new Date(filters.startDate);
        events = events.filter(event => event.startDate >= filterDate);
      }
      if (filters.endDate) {
        const filterDate = new Date(filters.endDate);
        events = events.filter(event => event.startDate <= filterDate);
      }
    }
    
    return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentId++;
    const event: Event = { ...insertEvent, id, createdAt: new Date() };
    this.events.set(id, event);
    return event;
  }

  // Trip methods
  async getUserTrips(userId: number): Promise<Trip[]> {
    return Array.from(this.trips.values())
      .filter(trip => trip.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getTrip(id: number): Promise<Trip | undefined> {
    return this.trips.get(id);
  }

  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = this.currentId++;
    const trip: Trip = { ...insertTrip, id, createdAt: new Date() };
    this.trips.set(id, trip);
    return trip;
  }

  async updateTrip(id: number, updates: Partial<Trip>): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    
    const updatedTrip = { ...trip, ...updates };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }

  // Accommodation methods
  async getAccommodations(filters?: { city?: string; type?: string; maxPrice?: number }): Promise<Accommodation[]> {
    let accommodations = Array.from(this.accommodations.values());
    
    if (filters) {
      if (filters.city) {
        accommodations = accommodations.filter(acc => 
          acc.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      if (filters.type) {
        accommodations = accommodations.filter(acc => acc.type === filters.type);
      }
      if (filters.maxPrice) {
        accommodations = accommodations.filter(acc => acc.pricePerNight <= filters.maxPrice!);
      }
    }
    
    return accommodations.sort((a, b) => a.pricePerNight - b.pricePerNight);
  }

  async getAccommodation(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const id = this.currentId++;
    const accommodation: Accommodation = { ...insertAccommodation, id, createdAt: new Date() };
    this.accommodations.set(id, accommodation);
    return accommodation;
  }

  // Training facility methods
  async getTrainingFacilities(filters?: { city?: string; type?: string; sports?: string[] }): Promise<TrainingFacility[]> {
    let facilities = Array.from(this.trainingFacilities.values());
    
    if (filters) {
      if (filters.city) {
        facilities = facilities.filter(facility => 
          facility.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      if (filters.type) {
        facilities = facilities.filter(facility => facility.type === filters.type);
      }
      if (filters.sports && filters.sports.length > 0) {
        facilities = facilities.filter(facility => 
          filters.sports!.some(sport => facility.sports?.includes(sport))
        );
      }
    }
    
    return facilities.sort((a, b) => a.pricePerDay - b.pricePerDay);
  }

  async getTrainingFacility(id: number): Promise<TrainingFacility | undefined> {
    return this.trainingFacilities.get(id);
  }

  async createTrainingFacility(insertFacility: InsertTrainingFacility): Promise<TrainingFacility> {
    const id = this.currentId++;
    const facility: TrainingFacility = { ...insertFacility, id, createdAt: new Date() };
    this.trainingFacilities.set(id, facility);
    return facility;
  }

  // Health metrics methods
  async getUserHealthMetrics(userId: number, limit = 30): Promise<HealthMetrics[]> {
    return Array.from(this.healthMetrics.values())
      .filter(metric => metric.userId === userId)
      .sort((a, b) => b.date!.getTime() - a.date!.getTime())
      .slice(0, limit);
  }

  async createHealthMetrics(insertMetrics: InsertHealthMetrics): Promise<HealthMetrics> {
    const id = this.currentId++;
    const metrics: HealthMetrics = { ...insertMetrics, id, createdAt: new Date() };
    this.healthMetrics.set(id, metrics);
    return metrics;
  }

  // Activity methods
  async getUserActivities(userId: number, limit = 20): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.date!.getTime() - a.date!.getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = { ...insertActivity, id, createdAt: new Date() };
    this.activities.set(id, activity);
    return activity;
  }

  // Reminder methods
  async getUserReminders(userId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values())
      .filter(reminder => reminder.userId === userId && !reminder.isCompleted)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const id = this.currentId++;
    const reminder: Reminder = { ...insertReminder, id, createdAt: new Date() };
    this.reminders.set(id, reminder);
    return reminder;
  }

  async updateReminder(id: number, updates: Partial<Reminder>): Promise<Reminder | undefined> {
    const reminder = this.reminders.get(id);
    if (!reminder) return undefined;
    
    const updatedReminder = { ...reminder, ...updates };
    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }
}

export const storage = new MemStorage();
