require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

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
});
