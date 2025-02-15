// Load environment variables from the .env file
import dotenv from 'dotenv';
dotenv.config();  // Make sure this line is at the top of the file

// Set default values if environment variables are not set
export const PORT = process.env.PORT || 5555;
export const mongoDBURL = process.env.MONGO_URI || 'mongodb://localhost:27017/vetconnect'; // Corrected URI
export const JWT_SECRET = process.env.JWT_SECRET || 'vhf$8mNSy!tXJ0ksd9@G2q#Hkz0v9d9wq2'; // Corrected formatting
