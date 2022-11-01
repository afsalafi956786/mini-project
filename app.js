const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const adminloginRouter = require('./routes/adminLogin')
const hbs = require('express-handlebars');
const app = express();
const db=require('./config/connection')
const productHelper=require('./helpers/product-helpers')
const session=require('express-session')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({extname: 'hbs',defaultLayout: 'layout',layoutsDir: __dirname + '/views/layouts/',partialsDir: __dirname + '/views/partials/'}))
// cache clear
app.use((req, res, next)=>{
  console.log('cache');
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"Key",cookie:{maxAge:6000000}}))
db.connect((error)=>{
  if(error) console.log("Connection error");
  else console.log("Database Connected to port 27017");
})
app.use(express.static(__dirname + '/public'));
app.use('/', usersRouter);
app.use('/admin', adminRouter);
app.use('/adminLogin',adminloginRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
