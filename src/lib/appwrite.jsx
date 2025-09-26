// src/lib/appwrite.js
import { Client, Account, Databases, Storage, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // API endpoint from .env
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Project ID from .env

// Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export client & ID generator
export { client, ID };
