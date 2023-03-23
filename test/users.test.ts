import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinon from 'sinon';
import { VerificationMailer } from '../src/mailer';
import { UserModel } from '../src/models/user';
import { app } from '../src/server';
import { connectToDatabase, disconnectFromDatabase } from './utils';

chai.use(chaiHttp);
const expect = chai.expect;

before(connectToDatabase);
after(disconnectFromDatabase);

const userData = {
  name: 'some User',
  email: 'test@example.com',
  skills: ['javascript', 'typescript'],
};

const verifiedUserData = {
  ...userData,
  isVerified: true,
};

beforeEach(async () => {
  await UserModel.deleteMany({});
});

describe('POST /users', () => {
  it('returns 201 and success message when a new user is registered', async () => {
    const sendEmail = Sinon.stub(
      VerificationMailer.prototype,
      'sendEmail',
    ).resolves();
    const response = await chai.request(app).post('/users').send(userData);

    expect(sendEmail.calledOnce).to.be.true;
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('Registered Successfully');
  });

  it('returns 409 and error message when an existing user tries to register', async () => {
    await UserModel.create(userData);
    const response = await chai.request(app).post('/users').send(userData);

    expect(response.status).to.equal(409);
    expect(response.body.errors[0].message)
      .to.include('email')
      .include('already exists');
  });

  it('returns 422 and error message when an invalid email is provided', async () => {
    const response = await chai
      .request(app)
      .post('/users')
      .send({
        name: 'New User',
        email: 'invalid email',
        skills: ['javascript', 'typescript'],
      });

    expect(response.status).to.equal(422);
    expect(response.body.message).to.equal('Validation Error');
    expect(response.body.errors).to.be.an('array');
    expect(response.body.errors).to.have.lengthOf(1);
    expect(response.body.errors[0]).to.deep.include({
      label: 'body.email',
      type: 'string.email',
      message: 'must be a valid email',
    });
  });

  it('returns 422 and error message when skills is less than 2', async () => {
    const response = await chai
      .request(app)
      .post('/users')
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        skills: ['javascript'],
      });

    expect(response.status).to.equal(422);
    expect(response.body.message).to.equal('Validation Error');
    expect(response.body.errors).to.be.an('array');
    expect(response.body.errors).to.have.lengthOf(1);
    expect(response.body.errors[0]).to.deep.include({
      label: 'body.skills',
      type: 'array.min',
      message: 'must contain at least 2 items',
    });
  });
});

describe('GET /users', () => {
  it('returns 200 and an empty list of users when no query is used (no verified users)', async () => {
    await UserModel.create(userData);
    const response = await chai.request(app).get('/users');

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(0);
  });

  it('returns 200 and an empty list of users when a query is used (no verified users)', async () => {
    await UserModel.create(userData);
    const response = await chai
      .request(app)
      .get('/users')
      .query({ skills: 'javascript' });

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(0);
  });

  it('returns 200 and an empty list of users when no query is used (verified users)', async () => {
    await UserModel.create(verifiedUserData);
    const response = await chai.request(app).get('/users');

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(0);
  });

  it('returns 200 and a list of users when a query is used (1 verified user) 1 skill query', async () => {
    await UserModel.create(verifiedUserData);
    const response = await chai
      .request(app)
      .get('/users')
      .query({ skills: verifiedUserData.skills[0] });

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(1);
    expect(response.body[0]).to.deep.include({
      name: verifiedUserData.name,
      email: verifiedUserData.email,
      skills: verifiedUserData.skills,
    });
  });

  it('returns 200 and a list of users when a query is used (verified users) and the query is case insensitive', async () => {
    await UserModel.create(verifiedUserData);
    const response = await chai
      .request(app)
      .get('/users')
      .query({ skills: verifiedUserData.skills[0].toUpperCase() });

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(1);
    expect(response.body[0]).to.deep.include({
      name: verifiedUserData.name,
      email: verifiedUserData.email,
      skills: verifiedUserData.skills,
    });
  });

  it('returns 200 and a list of users when name is used for query', async () => {
    const users = [
      verifiedUserData,
      { ...verifiedUserData, email: 'different@email.com' },
    ];
    await UserModel.create(users);
    const response = await chai
      .request(app)
      .get('/users')
      .query({ name: verifiedUserData.name });

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(2);
  });

  it('returns 200 and a list of users when 2 skills are used for query', async () => {
    const users = [
      verifiedUserData,
      { ...verifiedUserData, email: 'different@email.com' },
    ];
    await UserModel.create(users);
    const response = await chai
      .request(app)
      .get('/users?skills=javasCRIPT&skills=TYPEScript');

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(2);
  });
});

describe('POST /verify/:token', () => {
  it('returns 200 and a success message when a valid token is provided', async () => {
    const user = await UserModel.create(userData);
    const response = await chai
      .request(app)
      .post(`/users/verify/${user.verificationToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal(
      'Your email has been verified successfully!',
    );
  });

  it('returns 400 and an error message when an invalid token is provided', async () => {
    const response = await chai
      .request(app)
      .post('/users/verify/invalid-token');

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Invalid verification token');
  });
});
