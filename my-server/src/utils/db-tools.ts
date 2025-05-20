import mongoose from 'mongoose';
import { listAllIndexes } from '../models/indexes';

/**
 * Utility functions for database operations
 * These are helpful for debugging, testing, and maintenance
 */

/**
 * Print all indexes in the database to console
 * Useful for debugging and verifying index creation
 */
export const printAllIndexes = async (): Promise<void> => {
  try {
    const indexes = await listAllIndexes();
    console.log('=== Database Indexes ===');
    
    for (const [collection, collectionIndexes] of Object.entries(indexes)) {
      console.log(`\nCollection: ${collection}`);
      collectionIndexes.forEach((index, i) => {
        console.log(`  [${i}] ${index.name}: ${JSON.stringify(index.key)}`);
      });
    }
    
    console.log('\n=== End of Indexes ===');
  } catch (error) {
    console.error('Error printing indexes:', error);
  }
};

/**
 * Check if MongoDB is connected
 * @returns True if connected, false otherwise
 */
export const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get database statistics
 * @returns Object with database statistics
 */
export const getDatabaseStats = async (): Promise<any> => {
  if (!isMongoConnected()) {
    throw new Error('MongoDB is not connected');
  }
  
  try {
    const stats = await mongoose.connection.db.stats();
    return stats;
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  }
};

/**
 * Get collection statistics
 * @param collectionName Name of the collection
 * @returns Object with collection statistics
 */
export const getCollectionStats = async (collectionName: string): Promise<any> => {
  if (!isMongoConnected()) {
    throw new Error('MongoDB is not connected');
  }
  
  try {
    const stats = await mongoose.connection.db.collection(collectionName).stats();
    return stats;
  } catch (error) {
    console.error(`Error getting stats for collection ${collectionName}:`, error);
    throw error;
  }
};