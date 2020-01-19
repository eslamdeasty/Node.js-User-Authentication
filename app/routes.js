const express = require('express');
const app = express();
const router = express.Router();
module.exports = router;
const usermodel = require('./model/usermodel');
const passport =require('passport');
const bycrypt = require('bcryptjs');
const {authenticated } = require('../config/authenticated');

//passport config
require('../config/passport')(passport);

router.get('/' , (req , res)=>{
    res.render('pages/welcome');
});

router.get('/login' , (req , res)=>{
    res.render('pages/login');
});

router.get('/register' , (req , res)=>{
    res.render('pages/register');
});

router.get('/dashboard' , authenticated , (req , res)=>{
    res.render('pages/dashboard',{
        name : req.user.name
    });
})

router.post('/register' ,(req , res)=>{
    const { name , email , password , password2} = req.body;
    // errors
    let errors =[];

    if (!name || !email || !password || !password2){
        errors.push({msg :"please fill all fields"});
    }

    // check password match
    if (password != password2){
        errors.push({msg : "password not matched"})
    }

    // check password lenght
    if(password.length < 6){
        errors.push({msg : 'password should be at least 6 charchters'})
    }

    if(errors.length > 0){
            res.render('pages/register',{
            errors,
            // we render name , email , password to edit them again by the last values
            name,
            email,
            password,
            password2
        });
    }
     else{
        // validation passed
        usermodel.findOne({ email : email })
        .then(user =>{
            if (user){
                // user exist
                errors.push({ msg : 'email is already registerd'});
                res.render('pages/register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
            });
        }
         else {
            const newUser = new usermodel({
                name,
                email,
                password,
            });
         
            //  hash passsword
            bycrypt.genSalt(10 , (err, salt)=>
            bycrypt.hash(newUser.password , salt , (err,hash)=>{
                if (err) throw err;
                // set passsword to hashed
                newUser.password = hash;

                // save user
                newUser.save()
                .then(user =>{
                    req.flash('success_msg' , 'you are now registered and you can login')
                    res.redirect('/login');
                })
                .catch(err => console.log(err));
            })

            )
        }


        });

    }

});

//login handle
router.post('/login', (req , res , next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/login',
        failureFlash : true
    })(req,res,next)
});

//logout handle

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg' , 'you are logged out');
    res.redirect('/login');
});