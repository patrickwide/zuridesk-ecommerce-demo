import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    const database = process.env.MONGO_DATABASE;
    const mongoUri = `mongodb://mongodb:27017/${database}`;

    const conn = await mongoose.connect(mongoUri, {
      auth: {
        username,
        password,
      },
      authSource: 'admin'
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;