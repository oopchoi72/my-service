import mongoose from "mongoose";
import Event from "./Event";

/**
 * Initialize all database indexes
 * This function ensures all indexes are created and can be called at application startup
 */
export const initializeIndexes = async (): Promise<void> => {
  try {
    console.log("Initializing MongoDB indexes...");

    // Ensure Event model indexes
    await ensureEventIndexes();

    console.log("All indexes initialized successfully");
  } catch (error) {
    console.error("Error initializing indexes:", error);
    throw error;
  }
};

/**
 * Ensure all indexes for the Event model are created
 */
export const ensureEventIndexes = async (): Promise<void> => {
  try {
    // Check existing indexes to avoid conflicts
    const existingIndexes = await Event.collection.listIndexes().toArray();
    const existingIndexNames = existingIndexes.map((idx) => idx.name);

    // Basic index on startDateTime for date-based queries
    // This is defined in the schema, but we ensure it exists here too
    if (!existingIndexNames.includes("idx_start_date_time")) {
      await Event.collection.createIndex(
        { startDateTime: 1 },
        {
          background: true,
          name: "idx_start_date_time",
        }
      );
    }

    // Compound index for efficient monthly view queries
    if (!existingIndexNames.includes("idx_date_range")) {
      await Event.collection.createIndex(
        {
          startDateTime: 1,
          endDateTime: 1,
        },
        {
          background: true,
          name: "idx_date_range",
        }
      );
    }

    // Text index on title and description for search functionality
    if (!existingIndexNames.includes("idx_text_search")) {
      await Event.collection.createIndex(
        {
          title: "text",
          description: "text",
        },
        {
          background: true,
          weights: {
            title: 10, // Title is more important
            description: 5, // Description is less important
          },
          name: "idx_text_search",
        }
      );
    }

    console.log("Event model indexes ensured successfully");
  } catch (error) {
    console.error("Error creating Event indexes:", error);
    throw error;
  }
};

/**
 * List all indexes in the database
 * Useful for debugging and monitoring purposes
 */
export const listAllIndexes = async (): Promise<
  Record<string, mongoose.mongo.IndexSpecification[]>
> => {
  if (!mongoose.connection.db) {
    throw new Error("Database connection not established");
  }

  const collections = await mongoose.connection.db.collections();
  const result: Record<string, mongoose.mongo.IndexSpecification[]> = {};

  for (const collection of collections) {
    const indexes = await collection.indexes();
    result[collection.collectionName] = indexes;
  }

  return result;
};
