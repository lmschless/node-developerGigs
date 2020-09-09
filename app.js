import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import path from 'path';
import db from './db/database.js';
import GigRoute from './routes/GigsRoutes.js';
import morgan from 'morgan';

const __dirname = path.resolve();

const app = express();

//// 1) MIDDLEWARE
// removes console logger if in prod
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser Middleware
// Checks content-type against content to ensure it matches.
app.use(bodyParser.urlencoded({ extended: false }));

// Set static folder (so css and images can be accessed)
// Tells express to use top directory and look for a folder named public
app.use(express.static(path.join(__dirname, 'public')));

// test db
try {
  await db.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// Index Route
app.get('/', (req, res) => {
  res.render('index', { layout: 'landing' });
});

// Gig Routes
app.use('/gigs', GigRoute);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server started on port ${port}`));
