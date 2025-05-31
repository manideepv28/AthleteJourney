import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  sport: text("sport").notNull(),
  isAuthenticated: boolean("is_authenticated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sport: text("sport").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  country: text("country").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  participants: integer("participants").default(0),
  startTime: text("start_time"),
  registrationFee: real("registration_fee"),
  description: text("description"),
  imageUrl: text("image_url"),
  amenities: text("amenities").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  destination: text("destination").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  eventId: integer("event_id"),
  accommodation: jsonb("accommodation"),
  trainingFacilities: jsonb("training_facilities").array(),
  nutritionPlan: jsonb("nutrition_plan"),
  totalCost: real("total_cost").default(0),
  status: text("status").default("planning"), // planning, active, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // hotel, vacation_rental, hostel, athletic_hotel
  location: text("location").notNull(),
  city: text("city").notNull(),
  pricePerNight: real("price_per_night").notNull(),
  rating: real("rating").default(0),
  amenities: text("amenities").array(),
  athleticAmenities: text("athletic_amenities").array(),
  imageUrl: text("image_url"),
  description: text("description"),
  distanceToEvent: real("distance_to_event"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trainingFacilities = pgTable("training_facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // gym, pool, track, studio
  location: text("location").notNull(),
  city: text("city").notNull(),
  pricePerDay: real("price_per_day").notNull(),
  rating: real("rating").default(0),
  amenities: text("amenities").array(),
  sports: text("sports").array(),
  imageUrl: text("image_url"),
  description: text("description"),
  distanceFromAccommodation: real("distance_from_accommodation"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  restingHeartRate: integer("resting_heart_rate"),
  sleepScore: real("sleep_score"),
  recoveryScore: real("recovery_score"),
  weeklyDistance: real("weekly_distance"),
  weeklyWorkouts: integer("weekly_workouts"),
  weeklyCalories: integer("weekly_calories"),
  monthlyMiles: real("monthly_miles"),
  trainingStreak: integer("training_streak"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // running, cycling, swimming, strength, etc.
  name: text("name").notNull(),
  duration: integer("duration"), // in minutes
  distance: real("distance"), // in miles
  pace: text("pace"),
  location: text("location"),
  calories: integer("calories"),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // flight, training, registration, etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  dueDate: timestamp("due_date").notNull(),
  isCompleted: boolean("is_completed").default(false),
  priority: text("priority").default("medium"), // low, medium, high
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAuthenticated: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
  createdAt: true,
});

export const insertTrainingFacilitySchema = createInsertSchema(trainingFacilities).omit({
  id: true,
  createdAt: true,
});

export const insertHealthMetricsSchema = createInsertSchema(healthMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Trip = typeof trips.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Accommodation = typeof accommodations.$inferSelect;
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type TrainingFacility = typeof trainingFacilities.$inferSelect;
export type InsertTrainingFacility = z.infer<typeof insertTrainingFacilitySchema>;
export type HealthMetrics = typeof healthMetrics.$inferSelect;
export type InsertHealthMetrics = z.infer<typeof insertHealthMetricsSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
