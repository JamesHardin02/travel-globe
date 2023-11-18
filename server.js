// import dependencies
const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
require('dotenv').config();
const compression = require('compression');
// instantiate server
const app = express();
const PORT = process.env.PORT || 3001;

app.use(compression());

// import connection to sql db via sequelize
const sequelize = require("./config/connection");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// connect session data to db (saves session token to db)
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// gives server access to session
app.use(session(sess));

// adds custom helpers coded in ./utils/helpers to handlebars
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });
// set handlebars as template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// middleware for handling json data and supplying static assets for front end
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// use routes in controllers folder
app.use(require('./controllers/'));

// Create folder if does not exist for uploading thumbnail images of blog posts.
const filesDir = path.join(path.dirname(require.main.filename), "/public/img/blog-img/");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
};

// connects to db via sequelize and starts server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});