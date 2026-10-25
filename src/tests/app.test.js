const request = require('supertest');
const app = require('../app');

describe('Capstone application', () => {
  test('landing page responds with the app title', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Hello from the CI/CD Capstone');
  });

  test('health endpoint reports ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('readiness endpoint reports ready', async () => {
    const response = await request(app).get('/ready');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ready');
  });

  test('info endpoint exposes app metadata', async () => {
    const response = await request(app).get('/api/info');
    expect(response.body.name).toBe('aws-cicd-capstone');
  });

  test('unknown paths return JSON 404', async () => {
    const response = await request(app).get('/missing');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Not found');
  });
});
