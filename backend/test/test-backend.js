import assert from 'node:assert/strict';
import http from 'node:http';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = '';

const { default: app } = await import('../src/server.js');
const server = app.listen(0);
await new Promise((resolve) => server.once('listening', resolve));
const { port } = server.address();

function request(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port, path }, (res) => {
      res.resume();
      res.once('end', () => resolve(res.statusCode));
    }).once('error', reject);
  });
}

try {
  assert.equal(await request('/api/speak/config'), 200);
  assert.equal(await request('/api/delegates/passes'), 404);
  assert.equal(await request('/api/payment/passes'), 404);
  assert.equal(await request('/api/speakers/applications'), 404);
  assert.equal(await request('/api/student-speakers/applications'), 404);
  console.log('Active speak-flow API passed; removed APIs return 404.');
} finally {
  await new Promise((resolve) => server.close(resolve));
}
