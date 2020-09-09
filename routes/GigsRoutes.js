import express from 'express';
import db from '../db/database.js';
import GigModel from '../models/GigModel.js';
import Sequelize from 'sequelize';
import Op from 'sequelize';

const router = express.Router();

// Get Gig List (promise/then way)
// router.get('/', (req, res) => {
//   GigModel.findAll() // returns a promise
//     .then((gigs) => {
//       console.log(gigs);
//       res.sendStatus(200);
//     })
//     .catch((err) => console.log(err));
// });

// Get Gig List (async/await way)
router.get('/', async (req, res) => {
  try {
    const gigs = await GigModel.findAll();
    console.log(gigs);
    res.render('gigs', { gigs }); // render a gigs view, pass in data
  } catch (err) {
    console.log(err);
  }
});

// Display add gig form
router.get('/add', (req, res) => {
  res.render('add');
});

// Add a Gig
router.post('/add', (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;
  const errors = [];

  // server side validation for form fields
  if (!title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!technologies) {
    errors.push({ text: 'Please add some technologies' });
  }
  if (!description) {
    errors.push({ text: 'Please add a description' });
  }
  if (!contact_email) {
    errors.push({ text: 'Please add a contact email' });
  }
  // Check for errors
  if (errors.length > 0) {
    res.render('add', {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email,
    });
  } else {
    if (!budget) {
      budget = 'Unknown';
    } else {
      budget = `$${budget}`;
    }
    // for every comma (space), replace with just a comma.
    technologies = technologies.toLowerCase().replace(/, /g, ',');

    // Insert into table, Use sequalize create method
    GigModel.create({
      title,
      technologies,
      budget,
      description,
      contact_email,
    })
      .then((gigs) => {
        res.redirect('/gigs');
      })
      .catch((err) => console.log(err));
  }
});

// homepage search box, matches to the technologies field.
router.get('/search', (req, res) => {
  let { term } = req.query;

  term = term.toLowerCase;
  GigModel.findAll({
    where: { technologies: { [Sequelize.Op.like]: '%' + term + '%' } },
  })
    .then((gigs) => res.render('gigs', { gigs }))
    .catch((err) => console.log(err));
});

export default router;
