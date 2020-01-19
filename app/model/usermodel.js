const mongoose = require('mongoose'),
    schema = mongoose.Schema;

    const userSchema = new schema({
        name : {
            type : String,
            required : true
        } ,
        email : {
            type : String,
            required : true
        } ,
        password : {
            type : String,
            required : true
        },
        date : {
            type : Date,
            default : Date.now
        }


    });

    const usermodel = mongoose.model('usermodel' , userSchema , 'users' );

    module.exports = usermodel;