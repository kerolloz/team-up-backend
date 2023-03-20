import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/server';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /ping', () => {
  it('returns a 200 with {"message": "pong"}', async () => {
    const res = await chai.request(app).get('/ping');
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('pong');
  });
});
