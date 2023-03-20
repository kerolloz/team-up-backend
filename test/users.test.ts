import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import Sinon from 'sinon';
import { VerificationMailer } from '../src/mailer';
import { UserModel } from '../src/models/user';
import { app } from '../src/server';
import { connectToDatabase, disconnectFromDatabase } from './utils';

chai.use(chaiHttp);
const expect = chai.expect;

before(connectToDatabase);
after(disconnectFromDatabase);

describe('POST /users', () => {
  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    await UserModel.create({
      name: 'some User',
      email: 'test@example.com',
      skills: ['javascript', 'typescript'],
      verificationToken: 'token',
    });
  });

  it('returns a 201 status code and success message when a new user is registered', async () => {
    const sendEmail = Sinon.stub(
      VerificationMailer.prototype,
      'sendEmail',
    ).resolves();
    const response = await chai
      .request(app)
      .post('/users')
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        skills: ['javascript', 'typescript'],
      });

    expect(sendEmail.calledOnce).to.be.true;
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('Registered Successfully');
  });

  it('returns a 422 status code and error message when an existing user tries to register', async () => {
    const response = await chai
      .request(app)
      .post('/users')
      .send({
        name: 'Existing User',
        email: 'test@example.com',
        skills: ['javascript', 'typescript'],
      });

    expect(response.status).to.equal(422);
    expect(response.body.message).to.equal('Email already exists');
  });

  it('returns a 422 status code and error message when an invalid email is provided', async () => {
    const response = await chai
      .request(app)
      .post('/users')
      .send({
        name: 'New User',
        email: 'test',
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

  it('returns a 422 status code and error message when skills is less than 2', async () => {
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
