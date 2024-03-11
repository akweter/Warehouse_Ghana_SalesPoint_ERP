// Modules/Packages
const helmet = require('helmet');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { origin } = process.env;
const cache = require('./utils/caching/index');
require('dotenv').config();

// Projects
const indexRouter = require('./routes/index');
const wooCommerce = require('./routes/woocommerce');
const usersRoute = require('./routes/userManagement');
const Auth = require('./routes/auth');
const Activate = require('./routes/activateUser');
const Supplier = require('./routes/suppliers');
const Customer = require('./routes/customers');
const Inventory = require('./routes/inventory');
const SalesNInvoices = require('./routes/salesNinvoices');
const Refunds = require('./routes/refund');
const GRAPayload = require('./routes/sendGRAPayload');
const Test = require('./routes/test');
const Forbidden = require('./auth/globalHeaderToken');

const corsOriginSetup = {
  origin: '*',
  methods: 'GET, PUT, PATCH, POST, DELETE',
  credentials: true,
};

const server = express();

server.set('view engine', 'jade');
server.use(compression());
server.use(rateLimit({ windowMs: 5 * 60 * 1000, max: 500, }));
server.use(cors(corsOriginSetup));
server.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.sendStatus(200);
  } else {
    next();
  }
});
server.use(Forbidden);
server.use(helmet(
  {
    contentSecurityPolicy: {
      directives: {
        'script-src': ["self", `${origin}`],
        'style-src': null,
      },
    },
  }
));
server.use(logger('tiny'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));
server.use((req, res, next) => {
  const cacheKey = req.url;
  const cachedData = cache.get(cacheKey);
  if (cachedData) { res.json(cachedData); }
  else { next();}
});

server.use('/auth', Auth);
server.use('/activate', Activate);
server.use('/', indexRouter);
server.use('/woo', wooCommerce);
server.use('/users', usersRoute);
server.use('/suppliers', Supplier);
server.use('/customers', Customer);
server.use('/products', Inventory);
server.use('/invoices', SalesNInvoices);
server.use('/refunds', Refunds);
server.use('/gra', GRAPayload);
server.use('/test', Test);

server.use((req, res, next) => { next(createError(404)); });

server.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = server;
