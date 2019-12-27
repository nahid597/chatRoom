const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const config = require('../backend/config/config');
const connectMongo = require('connect-mongo')(session);
const mongoose = require('mongoose');
// const Schema = mongoose.Schema();
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy

const port = process.env.PORT || 8080;

mongoose.connect(config.dbURL, { useNewUrlParser: true }, function(err) {
    if (err) {
        console.log(err);
    }
    console.log('mongodb connected..')
})

// var p = path.join(__dirname, '../front');
// console.log(p);

app.set('front', path.join(__dirname, '../front'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '../front/index')));
app.use(express.static(path.join(__dirname, '../front/chatroom')));
app.use(express.static(path.join(__dirname, '../front/room')));
app.use(express.static(path.join(__dirname, '../front')));
app.use(cookieParser());

// passport middleware

var env = process.env.NODE_ENV || 'development';


if (env === 'development') {
    // set config file to development
    app.use(session({ secret: config.sessionSecret, resave: true, saveUninitialized: true }));

} else {
    // set configue file for production
    app.use(session({
        secret: config.sessionSecret,
        store: new connectMongo({
            // url: config.dbURL,
            mongoose_connection: mongoose.connections[0],
            stringfy: true
        }),
        resave: true,
        saveUninitialized: true
    }));

}

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth')(passport, facebookStrategy, config, mongoose);
require('./router/router')(express, app, path, passport);

app.listen(port, function() {
    console.log('server is running on port: ' + port);
    console.log('mode ' + env);
})