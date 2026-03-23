require('dotenv').config();

const mongoose = require('mongoose');

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`TaskFlow API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error.message);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      await mongoose.connection.close(false);
      process.exit(0);
    });
  } else {
    await mongoose.connection.close(false);
    process.exit(0);
  }
};

if (require.main === module) {
  startServer();

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      shutdown(signal).catch((error) => {
        console.error('Error during shutdown:', error.message);
        process.exit(1);
      });
    });
  });
}

module.exports = startServer;
