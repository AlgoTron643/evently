import mongoose from 'mongoose';

// In serverless connection where code can be used multiple times, but not in a single server process theres a need to manage database connections efficiently. Each invokation of a serverless connection could result in a new connection thereby its inefficient and can exhaust resources

const MONGODB_URI = process.env.MONGODB_URI;

// initialised cached variable with the attempt to retrieve a Mongoose object that provides a space to store global variable
let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  // connection runs for the first time
  if (cached.conn) return cached.conn;
  
  if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  // connect to an already established connection or new connection
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI,{
    dbName: 'evently',
    bufferCommands: false,
  })

  cached.conn = await cached.promise;

  return cached.conn;
}

// Server actions
// connectToDatabase() ...
// Each server action has to call the connectToDatabase() again and again, caching promise ensures that all subsequent connections can resuse the connection if it is open or just create a new one