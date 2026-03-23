const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.CLIENT_URL = 'http://localhost:5173';

const app = require('../app');
const Task = require('../models/Task');
const User = require('../models/User');

let mongoServer;

const registerUser = async (name, email) => {
  const response = await request(app).post('/api/v1/auth/register').send({
    name,
    email,
    password: 'StrongPass1'
  });

  return response.body.data;
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

afterEach(async () => {
  await Task.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Task API', () => {
  it('only allows users to access their own tasks', async () => {
    const owner = await registerUser('Owner User', 'owner@example.com');
    const intruder = await registerUser('Intruder User', 'intruder@example.com');

    const createResponse = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .send({
        title: 'Ship dashboard',
        description: 'Finish recruiter-ready task manager',
        status: 'todo'
      });

    const taskId = createResponse.body.data.task._id;

    const readResponse = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${intruder.accessToken}`);

    expect(readResponse.statusCode).toBe(404);
    expect(readResponse.body.code).toBe('TASK_NOT_FOUND');
  });

  it('supports search and pagination for the authenticated user', async () => {
    const user = await registerUser('Search User', 'search@example.com');

    await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${user.accessToken}`)
      .send({ title: 'Prepare interview notes', description: 'Study auth flow' });

    await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${user.accessToken}`)
      .send({ title: 'Plan release', description: 'Deploy to Render and Vercel' });

    const response = await request(app)
      .get('/api/v1/tasks?search=deploy&page=1&limit=1')
      .set('Authorization', `Bearer ${user.accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.tasks).toHaveLength(1);
    expect(response.body.data.pagination.total).toBe(1);
  });
});
