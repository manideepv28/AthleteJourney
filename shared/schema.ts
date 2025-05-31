import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  sport: text("sport"),
  level: text("level"),
  goals: jsonb("goals"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  sport: text("sport").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  price: integer("price"),
  difficulty: text("difficulty"),
  registrationDeadline: timestamp("registration_deadline"),
  imageUrl: text("image_url"),
  organizer: text("organizer"),
  capacity: integer("capacity"),
  registered: integer("registered").default(0),
});

export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  price: integer("price").notNull(),
  rating: integer("rating"),
  amenities: jsonb("amenities"),
  imageUrl: text("image_url"),
  description: text("description"),
  isAthleteFriendly: boolean("is_athlete_friendly").default(false),
  nearbyFacilities: jsonb("nearby_facilities"),
});

export const trainingFacilities = pgTable("training_facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  price: integer("price"),
  amenities: jsonb("amenities"),
  hours: jsonb("hours"),
  rating: integer("rating"),
  distance: text("distance"),
  status: text("status").default("open"),
});

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  eventId: integer("event_id").notNull(),
  accommodationId: integer("accommodation_id"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("planning"),
  itinerary: jsonb("itinerary"),
  notes: text("notes"),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  workoutType: text("workout_type"),
  duration: integer("duration"),
  distance: integer("distance"),
  calories: integer("calories"),
  notes: text("notes"),
  metrics: jsonb("metrics"),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  dueDate: timestamp("due_date"),
  isCompleted: boolean("is_completed").default(false),
  priority: text("priority").default("medium"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
});

export const insertTrainingFacilitySchema = createInsertSchema(trainingFacilities).omit({
  id: true,
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Accommodation = typeof accommodations.$inferSelect;
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type TrainingFacility = typeof trainingFacilities.$inferSelect;
export type InsertTrainingFacility = z.infer<typeof insertTrainingFacilitySchema>;
export type Trip = typeof trips.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
