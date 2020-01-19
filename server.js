const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    host = 'localhost' || '127.0.0.1',
    expressLayout = require('express-ejs-layouts'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    session = require('express-session');


    //passport config
    require('./config/passport')(passport);

    // static middleware
    app.set(express.static(__dirname + '/public'));

    // configure template engine
    app.use(expressLayout);
    app.set('view engine' , 'ejs');
    
    // use body parser
    app.use(bodyparser.urlencoded({extended :true}));

    //use flash
    app.use(flash());

    // use session
    app.use(session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true,
          }));
    
    //passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // global variables
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');

        next();
    });


    //coneect database
   mongoose.connect("mongodb://localhost:27017/users" , {useUnifiedTopology : true});


   // configure routes
   app.use(require('./app/routes'));


    // start server
    app.listen(port , host , ()=>{
        console.log(`server is running on ${port} and ${host}`);
    })
