import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import app from '../app';

describe('Tasks Routes', () => {
  beforeAll(async () => {
    // Setup test database or mock services
  });

  afterAll(async () => {
    // Cleanup test database or mock services
  });

  beforeEach(() => {
    // Reset mocks before each test
    if (vi && vi.clearAllMocks) {
      vi.clearAllMocks();
    }
  });

  describe('GET /api/tasks', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/tasks');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/tasks', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', 'Bearer fake-token')
        .send({
          description: 'Test Description'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', 'Bearer fake-token')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'invalid-priority'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', 'Bearer fake-token')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'invalid-status'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .get('/api/tasks/123');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid task ID format', async () => {
      const response = await request(app)
        .get('/api/tasks/invalid-id')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .put('/api/tasks/123')
        .send({
          title: 'Updated Task'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid task ID format', async () => {
      const response = await request(app)
        .put('/api/tasks/invalid-id')
        .set('Authorization', 'Bearer fake-token')
        .send({
          title: 'Updated Task'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .put('/api/tasks/123')
        .set('Authorization', 'Bearer fake-token')
        .send({
          priority: 'invalid-priority'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .delete('/api/tasks/123');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid task ID format', async () => {
      const response = await request(app)
        .delete('/api/tasks/invalid-id')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/tasks/:id/comments', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .post('/api/tasks/123/comments')
        .send({
          content: 'Test comment'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing content', async () => {
      const response = await request(app)
        .post('/api/tasks/123/comments')
        .set('Authorization', 'Bearer fake-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/tasks/:id/comments/:commentId', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app)
        .put('/api/tasks/123/comments/456')
        .send({
          content: 'Updated comment'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing content', async () => {
      const response = await request(app)
        .put('/api/tasks/123/comments/456')
        .set('Authorization', 'Bearer fake-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});