import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/server';

chai.use(chaiHttp);
const expect = chai.expect;

describe('HTTP server basic /ping', () => {
  it('should return "pong" for GET /ping', async () => {
    const res = await chai.request(app).get('/ping');
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('pong');
  });
});
