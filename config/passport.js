const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load user model
const usermodel = require('../app/model/usermodel');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField : 'email'}, (email,password,done)=>{
        //match user
        usermodel.findOne({email : email})
        .then(user =>{
            if(!user){
                return done(null , false , {message : 'email is not registered'});
            }
            console.log(user);
            
        //match password
        bcrypt.compare(password , user.password , (err , isMatched)=>{
            if(err) throw err;
            if(isMatched){
                return done(null,user);
            } else{
                return done(null,false,{message : 'password not correct'});
            }
        })

        })
        .catch((err) => {
             if(err) throw err
            });
        })
    );
        passport.serializeUser((user, done)=> {
            done(null, user.id);
        });
        
        passport.deserializeUser((id, done)=> {
            usermodel.findById(id, (err, user)=> {
            done(err, user);
        });
      });
}