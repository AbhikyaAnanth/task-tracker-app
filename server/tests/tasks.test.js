const request = require('supertest');
const express = require('express');
const tasksRouter = require('../routes/tasks');

// Mock dependencies
jest.mock('../controllers/taskController', () => ({
  getTasks: (req, res) => res.json([{ id: 1, name: 'Test Task' }]),
  getTaskById: (req, res) => res.json({ id: String(req.params.id), name: 'Test Task' }),
  createTask: (req, res) => res.status(201).json({ ...req.body, id: 2 }),
  updateTask: (req, res) => res.json({ ...req.body, id: req.params.id }),
  deleteTask: (req, res) => res.status(204).end()
}));

jest.mock('../models/Task', () => ({
  find: jest.fn().mockResolvedValue([{ id: 1, name: 'Debug Task' }])
}));

jest.mock('mongoose', () => ({
  connection: {
    readyState: 1,
    name: 'testdb',
    host: 'localhost',
    port: 27017
  }
}));

const app = express();
app.use(express.json());
app.use('/tasks', tasksRouter);

describe('Tasks Router', () => {
  test('GET /tasks returns tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('id');
  });

  test('GET /tasks/:id returns a task by id', async () => {
    const res = await request(app).get('/tasks/123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', '123');
  });

  test('POST /tasks creates a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ name: 'New Task' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'New Task');
    expect(res.body).toHaveProperty('id');
  });

  test('PUT /tasks/:id updates a task', async () => {
    const res = await request(app)
      .put('/tasks/123')
      .send({ name: 'Updated Task' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Task');
    expect(res.body).toHaveProperty('id', '123');
  });

  test('DELETE /tasks/:id deletes a task', async () => {
    const res = await request(app).delete('/tasks/123');
    expect(res.statusCode).toBe(204);
  });

  test('GET /tasks/debug returns debug info', async () => {
    const res = await request(app).get('/tasks/debug');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('connected', true);
    expect(res.body).toHaveProperty('database', 'testdb');
    expect(res.body).toHaveProperty('collection', 'tasks');
    expect(res.body).toHaveProperty('taskCount', 1);
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.connection).toMatchObject({
      host: 'localhost',
      port: 27017,
      name: 'testdb'
    });
  });
});