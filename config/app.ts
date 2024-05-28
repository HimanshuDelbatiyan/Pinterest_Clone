import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose  from "mongoose";
import passport  from "passport";
import passportLocal from "passport-local"
import flash from "connect-flash";
import session from "express-session"; // It is a third party session management tool

/**
 * Importing the Model's
 */
import User from "../models/users"
/**
 * Getting the defined group of routes from the another module.
 */
import indexRouter from '../routes';

/**
 * Getting the Strategy Class
 */
let localStrategy = passportLocal.Strategy;

/**
 * Creating the instance of express application
 */
const app = express();

/**
 * Using the mongoose .connect() to MongoDB database
 */
mongoose.connect("mongodb://localhost/pinterestMain");

/**
 * Once connection is initialized we can then access the "Connection Object"
 * and then can listen for various events it emits.
 */
const db = mongoose.connection;

/**
 * If the database connection encounters an error
 * it will trigger the error event handler.
 */
db.on('error', function() {
  console.error("Connection Error")
});

/**
 * If the database connection encounters an open event
 * it will trigger the OPEN event handler.
 */
db.once("open", function()
{
  // lOG THIS TEXT INTO THE CONSOLE.
  console.log(`Connected to MongoDB at Localhost`)
});

/**
 * Setting the view engine which is EJS (Embedded JavaScript) which will compile .ejs file into the "HTML"
 * Which will then be executed by the user browser.
 */
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views')); // Setting where our .ejs files are located

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Configuring the Express Application to use the Cookie parser to parse the cookies comming with the request.
app.use(cookieParser());
// Setting the "Static File" Directory
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../node_modules")));

// Configuring the Application to use "flash" (for Showing one time message)
app.use(flash());

/**
 * Configuring the Express application to use the session.
 */
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret: "Its me Baby" // This secret will be used to decrypt the session id received in form of cookies
}))

/**
 * Configuring the Express application to use the Passport for authentication.
 */
app.use(passport.initialize())



/**
 * Configuring the passport to use the local strategy for user authentication.
 * as well specifying the name for the field from where the user data will be collected,
 */
passport.use(new localStrategy({usernameField:"username",passwordField:"password"},User.authenticate()))

/** --> Note: This part should be after we have configured the Passport Strategy
 * Configuring the App to allow access to the User Session for Serialization and Deserialization
 * to Passport.js for "Session-based Authentication" Where the Passport can store and
 * retrieve information from the session.
 */
app.use(passport.session());

/**
 * This method will be called by the passport
 * throughout the user navigation around the website
 * to make the logged-in user information more accessible
 */
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


/**
 * Mounting the Middleware (Functions which are executed before any route/route handler function)
 * When the user requests "/" route then the Router instance/Group of routes defined in other files will be executed
 * Whichever route match will be executed otherwise 404
 *
 *
 * Note: When the request for this route is Received "/"
 * Then all the routes inside the Router instance will include this.
 * Means:--> Request--> "/users" route --> /posts result---> "/users/posts" in the address bar
 */
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err:any, req:any, res:any, next:any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


export default app;
