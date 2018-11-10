
var Contact = require("./../models/Schema")[0];

var sess;

module.exports = function(app,passport){
    app.use(function(req, res, next) {
        res.locals.user = req.session.username;
        console.log("executed");
        next();
      });
    app.get("/",(req,res)=>{
        
        
        if(!sess){
            sess =  req.session;
            console.log(sess.username);
            res.locals.user = sess.username;
        }
        
        res.render("index.html");
    });
    app.post('/login',passport.authenticate('local'),function(req, res) {
                    // If this function gets called, authentication was successful.
                    // `req.user` contains the authenticated user.
                    sess.username = req.user.username;
                    res.locals.user = sess.username;
                    res.render("about.html");
    });

    app.get("/about",(req,res)=>{
        //console.log(sess.username);
        if(sess){
            res.locals.user = sess.username;
        }
            res.render("about.html");
    });
    app.get("/logout",(req,res)=>{
        if(sess){
            sess.destroy();
        }
        req.session.destroy();
        res.render("index.html");
    });
    app.get("/contact",(req,res)=>{
        
        Contact.find({},{},function(err,docs){
            if(sess){
                res.locals.user = sess.username;
            }
            res.render("contact.html",{contacts:docs});
         });
           // res.render("contact.html");
      
    });
    app.get("/chat",(req,res)=>{
        if(sess){
            res.locals.user = sess.username;
        }
        res.render("chat.html");
    });
   app.post("/",(req,res)=>{
    res.send(req.body.comment);
   });
   app.post("/contact",(req,res)=>{
     const Joi = require("joi");

     var data = {name:req.body.name,email:req.body.email,message:req.body.message};
     const schema = Joi.object().keys({
        name:Joi.string().required().label("Please enter your name"),
        email:Joi.string().email().required(),
        message:Joi.string().required()
        

     });
     Joi.validate(data,schema,(err,value)=>{
        if(err){
            res.status(422).json({
                status:'error',
                message:'Invalid Request Data'+err.message,
                data:value
            });
        }else{
            Contact.create(data,function(err, record){
                if(err) throw err;
                Contact.find({},{},function(err,docs){
                   res.render("contact.html",{contacts:docs});
                });
       
            });
            
        }
     });
     
    
    
   });
    
}
