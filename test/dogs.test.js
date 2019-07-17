require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const People = require('../lib/models/People');
const Dog = require('../lib/models/Dog');

describe('dogs routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let owner = null;
  beforeEach(async() => {
    owner = JSON.parse(JSON.stringify(await People.create({ name: 'erin' })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a dog', () => {
    return request(app)
      .post('/api/v1/dogs')
      .send({ name: 'spot', age: 5, weight: '20 lbs', owner: owner._id })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'spot',
          age: 5,
          weight: '20 lbs',
          owner: expect.any(String),
          __v: 0
        });
      });
  });

  it('can get dogs', async() => {
    const dogs = await Dog.create([
      { name: 'spot', age: 5, weight: '20 lbs', owner: owner._id },
      { name: 'rover', age: 10, weight: '50 lbs', owner: owner._id },
      { name: 'bingo', age: 1, weight: '10 lbs', owner: owner._id }
    ]);

    return request(app)
      .get('/api/v1/dogs')
      .then(res => {
        const dogsJSON = JSON.parse(JSON.stringify(dogs));
        dogsJSON.forEach(dog => {
          expect(res.body).toContainEqual(dog);
        });
      });
  });

  it('can get a dog by id', async() => {
    const dog = await Dog.create({
      name: 'spot',
      age: 5,
      weight: '20 lbs',
      owner: owner._id
    });

    return request(app)
      .get(`/api/v1/dogs/${dog._id}`)
      .then(res => {
        const dogJSON = JSON.parse(JSON.stringify(dog));
        expect(res.body).toEqual({
          ...dogJSON,
          owner
        });
      });
  });

  it('can update a dog by id', async() => {
    const dog = await Dog.create({
      name: 'spot',
      age: 5,
      weight: '20 lbs',
      owner: owner._id
    });

    return request(app)
      .put(`/api/v1/dogs/${dog._id}`)
      .send({ name: 'rover', age: 10, weight: '5 lbs' })
      .then(res => {
        const dogJSON = JSON.parse(JSON.stringify(dog));
        expect(res.body).toEqual({
          ...dogJSON,
          name: 'rover',
          age: 10,
          weight: '5 lbs',
          owner: expect.any(String)
        });
      });
  });

  it('can delete a dog by id', async() => {
    const dog = await Dog.create({
      name: 'spot',
      age: 5,
      weight: '20 lbs',
      owner: owner._id
    });

    return request(app)
      .delete(`/api/v1/dogs/${dog._id}`)
      .then(res => {
        const dogJSON = JSON.parse(JSON.stringify(dog));
        expect(res.body).toEqual(dogJSON);
      });
  });
});
