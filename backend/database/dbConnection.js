import mongoose from "mongoose";

let connectionPromise = null;

export const dbConnection = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    })
    .then(() => {
      console.log("Connected to database!");
      return mongoose.connection;
    })
    .catch((err) => {
      console.log("Some error occured while connecting to database:", err);
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
};
