import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../app';

describe('Health Routes', () => {
  describe('GET /api/health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });

    it('should include system information', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.body).toHaveProperty('system');
      expect(response.body.system).toHaveProperty('platform');
      expect(response.body.system).toHaveProperty('arch');
      expect(response.body.system).toHaveProperty('node_version');
      expect(response.body.system).toHaveProperty('memory');
    });

    it('should include dependency status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.body).toHaveProperty('dependencies');
      expect(response.body.dependencies).toHaveProperty('supabase');
    });
  });

  describe('GET /api/health/ready', () => {
    it('should return 200 when service is ready', async () => {
      const response = await request(app)
        .get('/api/health/ready');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Service is ready');
      expect(response.body).toHaveProperty('checks');
    });

    it('should include readiness checks', async () => {
      const response = await request(app)
        .get('/api/health/ready');

      expect(response.body.checks).toHaveProperty('environment_variables');
      expect(response.body.checks).toHaveProperty('memory_usage');
      expect(response.body.checks).toHaveProperty('disk_space');
    });
  });

  describe('GET /api/health/live', () => {
    it('should return 200 when service is alive', async () => {
      const response = await request(app)
        .get('/api/health/live');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Service is alive');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should have valid timestamp format', async () => {
      const response = await request(app)
        .get('/api/health/live');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });
  });
});