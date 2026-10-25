const request = require('supertest');
const app = require('../src/app');
describe('Capstone application',()=>{
 test('landing page responds with the app title',async()=>{const r=await request(app).get('/');expect(r.status).toBe(200);expect(r.text).toContain('Hello from the CI/CD Capstone');});
 test('health endpoint reports ok',async()=>{const r=await request(app).get('/health');expect(r.status).toBe(200);expect(r.body.status).toBe('ok');});
 test('readiness endpoint reports ready',async()=>{const r=await request(app).get('/ready');expect(r.status).toBe(200);expect(r.body.status).toBe('ready');});
 test('info endpoint exposes app metadata',async()=>{const r=await request(app).get('/api/info');expect(r.body.name).toBe('aws-cicd-capstone');});
 test('unknown paths return JSON 404',async()=>{const r=await request(app).get('/missing');expect(r.status).toBe(404);expect(r.body.error).toBe('Not found');});
});
