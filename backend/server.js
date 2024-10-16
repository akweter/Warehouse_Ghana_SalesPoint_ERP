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
require('dotenv').config();

// Projects
const { origin } = process.env;
const cache = require('./utils/caching/index');
const indexRouter = require('./routes/index');
const wooCommerce = require('./routes/woocommerce');
const usersRoute = require('./routes/userManagement');
const Auth = require('./routes/auth');
const Activate = require('./routes/activateUser');
const Supplier = require('./routes/suppliers');
const Customer = require('./routes/customers');
const Inventory = require('./routes/inventory');
const Waybill = require('./routes/waybill');
const SalesNInvoices = require('./routes/salesNinvoices');
const Refunds = require('./routes/refund');
const Payload = require('./routes/sendPayload');
const GRAPayload = require('./routes/sendGRAPayload');
const Company = require('./routes/company');
const Forbidden = require('./auth/globalHeaderToken');
const { logErrorMessages } = require('./utils/saveLogfile');

const corsOriginSetup = {
  origin: origin,
  methods: 'GET, PUT, PATCH, POST, DELETE',
  credentials: true,
};

const server = express();

server.set('view engine', 'jade');
server.set('maxHttpHeaderSize', 30 * 1024);
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
server.use('/waybill', Waybill);
server.use('/refunds', Refunds);
server.use('/payload', Payload);
server.use('/gra', GRAPayload);
server.use('/company', Company);

// Custom 404 error handling
server.use((req, res, next) => {
  res.status(404).json({
    message: 'Becareful!',
    status: 404
  });
});

// Global error handler
server.use((err, req, res, next) => {
  logErrorMessages(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    status: err.status || 500
  });
});



module.exports = server;
