const { Router } = require('express');
const People = require('../models/People');
const Dog = require('../models/Dog');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { name, 
      city, 
      state, 
      profileImage, 
      email } = req.body;

    People
      .create({ name, city, state, profileImage, email })
      .then(people => res.send(people))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    People
      .find()
      .then(people => res.send(people))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      People.findById(req.params.id),
      Dog.find({ owner: req.params.id })
    ])
      .then(([people, dogs]) => res.send({ ...people.toJSON(), dogs }))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const { name } = req.body;

    People
      .findByIdAndUpdate(req.params.id, { name }, { new: true })
      .then(people => res.send(people))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    People
      .findByIdAndDelete(req.params.id)
      .then(people => res.send(people))
      .catch(next);
  });
