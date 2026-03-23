const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.CLIENT_URL = 'http://localhost:5173';

const app = require('../app');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  await mongoose.connect(process.env.MONGODB_URI);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Auth API', () => {
  it('registers a new user and returns access and refresh tokens', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'StrongPass1'
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('ada@example.com');
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
  });

  it('rotates refresh tokens', async () => {
    const registerResponse = await request(app).post('/api/v1/auth/register').send({
      name: 'Grace Hopper',
      email: 'grace@example.com',
      password: 'StrongPass1'
    });

    const firstRefreshToken = registerResponse.body.data.refreshToken;

    const refreshResponse = await request(app).post('/api/v1/auth/refresh').send({
      refreshToken: firstRefreshToken
    });

    expect(refreshResponse.statusCode).toBe(200);
    expect(refreshResponse.body.data.refreshToken).toBeDefined();
    expect(refreshResponse.body.data.refreshToken).not.toBe(firstRefreshToken);
  });
});
