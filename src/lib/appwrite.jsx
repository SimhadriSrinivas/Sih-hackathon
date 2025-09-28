// src/lib/appwrite.js
import { Client, Account, Databases, Storage, ID, Query } from "appwrite";

// Create Appwrite client
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // API endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Project ID

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export client, ID, and Query
export { client, ID, Query };
