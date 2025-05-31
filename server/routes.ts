import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEventSchema, insertTripSchema, insertProgressSchema, insertReminderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // For demo purposes, store password as-is (in production, hash it)
      const user = await storage.createUser(userData);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // For demo purposes, simple password check (in production, use bcrypt)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const { sport, location, date, difficulty } = req.query;
      
      if (sport || location || date || difficulty) {
        const events = await storage.searchEvents({
          sport: sport as string,
          location: location as string,
          date: date as string,
          difficulty: difficulty as string,
        });
        res.json(events);
      } else {
        const events = await storage.getEvents();
        res.json(events);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get events", error });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to get event", error });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data", error });
    }
  });

  // Accommodation routes
  app.get("/api/accommodations", async (req, res) => {
    try {
      const { location } = req.query;
      
      if (location) {
        const accommodations = await storage.searchAccommodations(location as string);
        res.json(accommodations);
      } else {
        const accommodations = await storage.getAccommodations();
        res.json(accommodations);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get accommodations", error });
    }
  });

  app.get("/api/accommodations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const accommodation = await storage.getAccommodation(id);
      
      if (!accommodation) {
        return res.status(404).json({ message: "Accommodation not found" });
      }

      res.json(accommodation);
    } catch (error) {
      res.status(500).json({ message: "Failed to get accommodation", error });
    }
  });

  // Training facility routes
  app.get("/api/training-facilities", async (req, res) => {
    try {
      const { location } = req.query;
      
      if (location) {
        const facilities = await storage.searchTrainingFacilities(location as string);
        res.json(facilities);
      } else {
        const facilities = await storage.getTrainingFacilities();
        res.json(facilities);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get training facilities", error });
    }
  });

  app.get("/api/training-facilities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const facility = await storage.getTrainingFacility(id);
      
      if (!facility) {
        return res.status(404).json({ message: "Training facility not found" });
      }

      res.json(facility);
    } catch (error) {
      res.status(500).json({ message: "Failed to get training facility", error });
    }
  });

  // Trip routes
  app.get("/api/users/:userId/trips", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const trips = await storage.getUserTrips(userId);
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trips", error });
    }
  });

  app.post("/api/trips", async (req, res) => {
    try {
      const tripData = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(tripData);
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: "Invalid trip data", error });
    }
  });

  app.put("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const trip = await storage.updateTrip(id, updates);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trip", error });
    }
  });

  // Progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress", error });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertProgressSchema.parse(req.body);
      const progress = await storage.createProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data", error });
    }
  });

  // Reminder routes
  app.get("/api/users/:userId/reminders", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reminders = await storage.getUserReminders(userId);
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get reminders", error });
    }
  });

  app.post("/api/reminders", async (req, res) => {
    try {
      const reminderData = insertReminderSchema.parse(req.body);
      const reminder = await storage.createReminder(reminderData);
      res.json(reminder);
    } catch (error) {
      res.status(400).json({ message: "Invalid reminder data", error });
    }
  });

  app.put("/api/reminders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const reminder = await storage.updateReminder(id, updates);
      if (!reminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }

      res.json(reminder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update reminder", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
