import { 
  users, 
  events, 
  accommodations, 
  trainingFacilities, 
  trips, 
  progress, 
  reminders,
  type User, 
  type InsertUser,
  type Event,
  type InsertEvent,
  type Accommodation,
  type InsertAccommodation,
  type TrainingFacility,
  type InsertTrainingFacility,
  type Trip,
  type InsertTrip,
  type Progress,
  type InsertProgress,
  type Reminder,
  type InsertReminder
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Event operations
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  searchEvents(filters: { sport?: string; location?: string; date?: string; difficulty?: string }): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Accommodation operations
  getAccommodations(): Promise<Accommodation[]>;
  getAccommodation(id: number): Promise<Accommodation | undefined>;
  searchAccommodations(location: string): Promise<Accommodation[]>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;

  // Training facility operations
  getTrainingFacilities(): Promise<TrainingFacility[]>;
  getTrainingFacility(id: number): Promise<TrainingFacility | undefined>;
  searchTrainingFacilities(location: string): Promise<TrainingFacility[]>;
  createTrainingFacility(facility: InsertTrainingFacility): Promise<TrainingFacility>;

  // Trip operations
  getUserTrips(userId: number): Promise<Trip[]>;
  getTrip(id: number): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, updates: Partial<InsertTrip>): Promise<Trip | undefined>;

  // Progress operations
  getUserProgress(userId: number): Promise<Progress[]>;
  createProgress(progress: InsertProgress): Promise<Progress>;

  // Reminder operations
  getUserReminders(userId: number): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, updates: Partial<InsertReminder>): Promise<Reminder | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private accommodations: Map<number, Accommodation>;
  private trainingFacilities: Map<number, TrainingFacility>;
  private trips: Map<number, Trip>;
  private progress: Map<number, Progress>;
  private reminders: Map<number, Reminder>;
  private currentUserId: number;
  private currentEventId: number;
  private currentAccommodationId: number;
  private currentTrainingFacilityId: number;
  private currentTripId: number;
  private currentProgressId: number;
  private currentReminderId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.accommodations = new Map();
    this.trainingFacilities = new Map();
    this.trips = new Map();
    this.progress = new Map();
    this.reminders = new Map();
    this.currentUserId = 1;
    this.currentEventId = 1;
    this.currentAccommodationId = 1;
    this.currentTrainingFacilityId = 1;
    this.currentTripId = 1;
    this.currentProgressId = 1;
    this.currentReminderId = 1;

    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize sample events
    const sampleEvents: Event[] = [
      {
        id: this.currentEventId++,
        title: "Boston Marathon",
        description: "Join thousands of runners in this iconic 26.2-mile race through Boston's historic neighborhoods.",
        sport: "Running",
        location: "Boston, MA",
        date: new Date("2024-03-15"),
        price: 250,
        difficulty: "Advanced",
        registrationDeadline: new Date("2024-02-15"),
        imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643",
        organizer: "Boston Athletic Association",
        capacity: 30000,
        registered: 28500,
      },
      {
        id: this.currentEventId++,
        title: "Alps Challenge",
        description: "Conquer the challenging mountain passes of the French Alps in this multi-stage cycling event.",
        sport: "Cycling",
        location: "French Alps",
        date: new Date("2024-04-22"),
        price: 450,
        difficulty: "Expert",
        registrationDeadline: new Date("2024-03-22"),
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
        organizer: "Alpine Sports Federation",
        capacity: 500,
        registered: 320,
      },
      {
        id: this.currentEventId++,
        title: "Open Water Championship",
        description: "Test your endurance in crystal clear waters with distances from 1K to 10K available.",
        sport: "Swimming",
        location: "Lake Tahoe, CA",
        date: new Date("2024-05-08"),
        price: 180,
        difficulty: "Intermediate",
        registrationDeadline: new Date("2024-04-08"),
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        organizer: "Open Water Swimming Association",
        capacity: 1000,
        registered: 750,
      },
    ];

    sampleEvents.forEach(event => {
      this.events.set(event.id, event);
    });

    // Initialize sample accommodations
    const sampleAccommodations: Accommodation[] = [
      {
        id: this.currentAccommodationId++,
        name: "The Athletic Downtown",
        location: "Boston, MA",
        price: 189,
        rating: 48,
        amenities: ["Gym", "Pool", "Nutrition Center", "Recovery Room"],
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        description: "Modern hotel with state-of-the-art athletic facilities",
        isAthleteFriendly: true,
        nearbyFacilities: ["Elite Performance Center", "Boston Athletic Track"],
      },
      {
        id: this.currentAccommodationId++,
        name: "Recovery Resort & Spa",
        location: "Scottsdale, AZ",
        price: 299,
        rating: 49,
        amenities: ["Spa", "Track", "Nutrition", "Recovery Center"],
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        description: "Luxury resort focused on athletic recovery and performance",
        isAthleteFriendly: true,
        nearbyFacilities: ["Desert Training Center", "Mountain Trails"],
      },
      {
        id: this.currentAccommodationId++,
        name: "FitStay Budget Inn",
        location: "Austin, TX",
        price: 89,
        rating: 42,
        amenities: ["Gym", "Bike Storage", "WiFi"],
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        description: "Budget-friendly accommodation with essential athletic amenities",
        isAthleteFriendly: true,
        nearbyFacilities: ["City Bike Trails", "Public Pool"],
      },
    ];

    sampleAccommodations.forEach(accommodation => {
      this.accommodations.set(accommodation.id, accommodation);
    });

    // Initialize sample training facilities
    const sampleFacilities: TrainingFacility[] = [
      {
        id: this.currentTrainingFacilityId++,
        name: "Elite Performance Center",
        location: "Boston, MA",
        type: "Full Gym",
        price: 25,
        amenities: ["Pool", "Track", "Weights", "Cardio"],
        hours: { "mon-fri": "5:00-23:00", "sat-sun": "6:00-22:00" },
        rating: 49,
        distance: "0.3 miles",
        status: "open",
      },
      {
        id: this.currentTrainingFacilityId++,
        name: "CrossFit Downtown",
        location: "Boston, MA",
        type: "CrossFit",
        price: 30,
        amenities: ["CrossFit Equipment", "Classes", "Personal Training"],
        hours: { "mon-fri": "6:00-22:00", "sat-sun": "8:00-20:00" },
        rating: 46,
        distance: "0.7 miles",
        status: "busy",
      },
      {
        id: this.currentTrainingFacilityId++,
        name: "Aquatic Center",
        location: "Boston, MA",
        type: "Swimming",
        price: 15,
        amenities: ["Olympic Pool", "Diving", "Swimming Lessons"],
        hours: { "mon-fri": "5:30-22:00", "sat-sun": "7:00-20:00" },
        rating: 47,
        distance: "1.2 miles",
        status: "open",
      },
    ];

    sampleFacilities.forEach(facility => {
      this.trainingFacilities.set(facility.id, facility);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      sport: insertUser.sport || null,
      level: insertUser.level || null,
      goals: insertUser.goals || null,
      preferences: insertUser.preferences || null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async searchEvents(filters: { sport?: string; location?: string; date?: string; difficulty?: string }): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => {
      if (filters.sport && filters.sport !== "All Sports" && event.sport !== filters.sport) return false;
      if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.difficulty && filters.difficulty !== "Any Level" && event.difficulty !== filters.difficulty) return false;
      return true;
    });
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const event: Event = { 
      ...insertEvent, 
      id,
      difficulty: insertEvent.difficulty || null,
      description: insertEvent.description || null,
      price: insertEvent.price || null,
      registrationDeadline: insertEvent.registrationDeadline || null,
      imageUrl: insertEvent.imageUrl || null,
      organizer: insertEvent.organizer || null,
      capacity: insertEvent.capacity || null,
      registered: insertEvent.registered || null,
    };
    this.events.set(id, event);
    return event;
  }

  // Accommodation operations
  async getAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values());
  }

  async getAccommodation(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async searchAccommodations(location: string): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values()).filter(accommodation =>
      accommodation.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const id = this.currentAccommodationId++;
    const accommodation: Accommodation = { 
      ...insertAccommodation, 
      id,
      description: insertAccommodation.description || null,
      imageUrl: insertAccommodation.imageUrl || null,
      rating: insertAccommodation.rating || null,
      isAthleteFriendly: insertAccommodation.isAthleteFriendly || null,
    };
    this.accommodations.set(id, accommodation);
    return accommodation;
  }

  // Training facility operations
  async getTrainingFacilities(): Promise<TrainingFacility[]> {
    return Array.from(this.trainingFacilities.values());
  }

  async getTrainingFacility(id: number): Promise<TrainingFacility | undefined> {
    return this.trainingFacilities.get(id);
  }

  async searchTrainingFacilities(location: string): Promise<TrainingFacility[]> {
    return Array.from(this.trainingFacilities.values()).filter(facility =>
      facility.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  async createTrainingFacility(insertFacility: InsertTrainingFacility): Promise<TrainingFacility> {
    const id = this.currentTrainingFacilityId++;
    const facility: TrainingFacility = { 
      ...insertFacility, 
      id,
      status: insertFacility.status || null,
      price: insertFacility.price || null,
      rating: insertFacility.rating || null,
      distance: insertFacility.distance || null,
    };
    this.trainingFacilities.set(id, facility);
    return facility;
  }

  // Trip operations
  async getUserTrips(userId: number): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter(trip => trip.userId === userId);
  }

  async getTrip(id: number): Promise<Trip | undefined> {
    return this.trips.get(id);
  }

  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = this.currentTripId++;
    const trip: Trip = { 
      ...insertTrip, 
      id,
      accommodationId: insertTrip.accommodationId || null,
      status: insertTrip.status || null,
      itinerary: insertTrip.itinerary || null,
      notes: insertTrip.notes || null,
    };
    this.trips.set(id, trip);
    return trip;
  }

  async updateTrip(id: number, updates: Partial<InsertTrip>): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    
    const updatedTrip = { ...trip, ...updates };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }

  // Progress operations
  async getUserProgress(userId: number): Promise<Progress[]> {
    return Array.from(this.progress.values()).filter(p => p.userId === userId);
  }

  async createProgress(insertProgress: InsertProgress): Promise<Progress> {
    const id = this.currentProgressId++;
    const progress: Progress = { 
      ...insertProgress, 
      id,
      date: new Date(),
    };
    this.progress.set(id, progress);
    return progress;
  }

  // Reminder operations
  async getUserReminders(userId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values()).filter(reminder => reminder.userId === userId);
  }

  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const id = this.currentReminderId++;
    const reminder: Reminder = { ...insertReminder, id };
    this.reminders.set(id, reminder);
    return reminder;
  }

  async updateReminder(id: number, updates: Partial<InsertReminder>): Promise<Reminder | undefined> {
    const reminder = this.reminders.get(id);
    if (!reminder) return undefined;
    
    const updatedReminder = { ...reminder, ...updates };
    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }
}

export const storage = new MemStorage();
