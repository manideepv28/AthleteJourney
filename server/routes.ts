import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEventSchema, insertTripSchema, insertAccommodationSchema, insertTrainingFacilitySchema, insertHealthMetricsSchema, insertActivitySchema, insertReminderSchema } from "@shared/schema";
import bcrypt from "bcrypt";

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
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Update authentication status
      await storage.updateUser(user.id, { isAuthenticated: true });
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/user/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(parseInt(req.params.id), updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const filters = {
        sport: req.query.sport as string,
        location: req.query.location as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string
      };
      
      const events = await storage.getEvents(filters);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(parseInt(req.params.id));
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  // Trip routes
  app.get("/api/trips/user/:userId", async (req, res) => {
    try {
      const trips = await storage.getUserTrips(parseInt(req.params.userId));
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", async (req, res) => {
    try {
      const trip = await storage.getTrip(parseInt(req.params.id));
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trip" });
    }
  });

  app.post("/api/trips", async (req, res) => {
    try {
      const tripData = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(tripData);
      res.status(201).json(trip);
    } catch (error) {
      res.status(400).json({ message: "Invalid trip data" });
    }
  });

  app.put("/api/trips/:id", async (req, res) => {
    try {
      const updates = req.body;
      const trip = await storage.updateTrip(parseInt(req.params.id), updates);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trip" });
    }
  });

  // Accommodation routes
  app.get("/api/accommodations", async (req, res) => {
    try {
      const filters = {
        city: req.query.city as string,
        type: req.query.type as string,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined
      };
      
      const accommodations = await storage.getAccommodations(filters);
      res.json(accommodations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accommodations" });
    }
  });

  app.get("/api/accommodations/:id", async (req, res) => {
    try {
      const accommodation = await storage.getAccommodation(parseInt(req.params.id));
      if (!accommodation) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      res.json(accommodation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accommodation" });
    }
  });

  // Training facility routes
  app.get("/api/training-facilities", async (req, res) => {
    try {
      const filters = {
        city: req.query.city as string,
        type: req.query.type as string,
        sports: req.query.sports ? (req.query.sports as string).split(",") : undefined
      };
      
      const facilities = await storage.getTrainingFacilities(filters);
      res.json(facilities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch training facilities" });
    }
  });

  app.get("/api/training-facilities/:id", async (req, res) => {
    try {
      const facility = await storage.getTrainingFacility(parseInt(req.params.id));
      if (!facility) {
        return res.status(404).json({ message: "Training facility not found" });
      }
      res.json(facility);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch training facility" });
    }
  });

  // Health metrics routes
  app.get("/api/health-metrics/user/:userId", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const metrics = await storage.getUserHealthMetrics(parseInt(req.params.userId), limit);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });

  app.post("/api/health-metrics", async (req, res) => {
    try {
      const metricsData = insertHealthMetricsSchema.parse(req.body);
      const metrics = await storage.createHealthMetrics(metricsData);
      res.status(201).json(metrics);
    } catch (error) {
      res.status(400).json({ message: "Invalid health metrics data" });
    }
  });

  // Activity routes
  app.get("/api/activities/user/:userId", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getUserActivities(parseInt(req.params.userId), limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  // Reminder routes
  app.get("/api/reminders/user/:userId", async (req, res) => {
    try {
      const reminders = await storage.getUserReminders(parseInt(req.params.userId));
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  app.post("/api/reminders", async (req, res) => {
    try {
      const reminderData = insertReminderSchema.parse(req.body);
      const reminder = await storage.createReminder(reminderData);
      res.status(201).json(reminder);
    } catch (error) {
      res.status(400).json({ message: "Invalid reminder data" });
    }
  });

  app.put("/api/reminders/:id", async (req, res) => {
    try {
      const updates = req.body;
      const reminder = await storage.updateReminder(parseInt(req.params.id), updates);
      
      if (!reminder) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      
      res.json(reminder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update reminder" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
