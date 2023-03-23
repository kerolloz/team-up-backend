import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/server';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /ping', () => {
  it('returns 200 with {"message": "pong"}', async () => {
    const res = await chai.request(app).get('/ping');
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('pong');
  });
});

describe('GET /a-path-that-does-not-exist', () => {
  it('returns 404 with {"message": "Not Found"}', async () => {
    const res = await chai.request(app).get('/a-path-that-does-not-exist');
    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('Are you lost?');
  });
});
