require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const People = require('../lib/models/People');
const Dog = require('../lib/models/Dog');



describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  
  it('creates a new people', () => {
    return request(app)
      .post('/api/v1/peoples')
      .send({ name: 'Erin',
        city: 'Portland', 
        state: 'Oregon',
        email: 'erinmgurley@gmail.com', 
        profileImage: 'https://i.ytimg.com/vi/-2cj5pPe778/maxresdefault.jpg'
      })
      .then(res => { {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Erin', 
          city: 'Portland', 
          state: 'Oregon', 
          profileImage: 'https://i.ytimg.com/vi/-2cj5pPe778/maxresdefault.jpg', 
          email: 'erinmgurley@gmail.com', 
          __v:0
        });
      }});
  });

  it('can get peoples', async() => {
    const peoples = await People.create([
      { name: 'erin' },
      { name: 'erin1' },
      { name: 'erin2' }
    ]);

    return request(app)
      .get('/api/v1/peoples')
      .then(res => {
        const peopleJSON = JSON.parse(JSON.stringify(peoples));
        peopleJSON.forEach(people => {
          expect(res.body).toContainEqual(people);
        });
      });
  });

  it('can get a people by id', async() => {
    const people = await People.create({ name: 'erin' });
    const dogs = await Dog.create([
      { name: 'spot', age: 5, weight: '20 lbs', owner: people._id },
      { name: 'rover', age: 10, weight: '50 lbs', owner: people._id },
      { name: 'bingo', age: 1, weight: '10 lbs', owner: people._id }
    ]);

    return request(app)
      .get(`/api/v1/peoples/${people._id}`)
      .then(res => {
        const dogsJSON = JSON.parse(JSON.stringify(dogs));
        console.log(res.body.name);
        expect(res.body.name).toEqual('erin');
        console.log(dogsJSON)
        dogsJSON.forEach(dog => {
          expect(res.body.dogs).toContainEqual(dog);
        });
      });
  });

  it('can update a people by id', async() => {
    const people = await People.create({ name: 'erin' });

    return request(app)
      .put(`/api/v1/peoples/${people._id}`)
      .send({ name: 'erin2' })
      .then(res => {
        const peopleJSON = JSON.parse(JSON.stringify(people));
        expect(res.body).toEqual({
          ...peopleJSON,
          name: 'erin2'
        });
      });
  });

  it('can delete a people by id', async() => {
    const people = await People.create({ name: 'erin' });

    return request(app)
      .delete(`/api/v1/peoples/${people._id}`)
      .then(res => {
        const peopleJSON = JSON.parse(JSON.stringify(people));
        expect(res.body).toEqual(peopleJSON);
      });
  });
});

