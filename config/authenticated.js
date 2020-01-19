module.exports = {
    authenticated : function(req,res,next){
     if(req.isAuthenticated() ){
     return next();
    }
    req.flash('error_msg' , 'you must log in to see this page') ;
    res.redirect('/login');
}
}